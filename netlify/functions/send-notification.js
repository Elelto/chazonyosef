const admin = require('firebase-admin')

if (!admin.apps.length) {
  try {
    // Only private key is sensitive - rest can be hardcoded
    const serviceAccount = {
      type: 'service_account',
      project_id: 'chazon-e3dc4',
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_ADMIN_CLIENT_EMAIL)}`
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'chazon-e3dc4'
    })
    
    console.log('✅ Firebase Admin initialized')
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error)
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { title, body, link } = JSON.parse(event.body)

    if (!title || !body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Title and body are required' })
      }
    }

    console.log('📤 Sending notification:', { title, body, link })

    const db = admin.firestore()
    const tokensSnapshot = await db.collection('fcmTokens').get()

    if (tokensSnapshot.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No subscribers found',
          successCount: 0,
          failureCount: 0
        })
      }
    }

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token)
    console.log(`📱 Found ${tokens.length} tokens`)

    const message = {
      notification: {
        title,
        body
      },
      data: {
        link: link || '/',
        timestamp: Date.now().toString()
      },
      webpush: {
        notification: {
          title,
          body,
          icon: '/icon-192.png',
          badge: '/icon-72.png',
          dir: 'rtl',
          lang: 'he',
          requireInteraction: false,
          vibrate: [200, 100, 200]
        },
        fcmOptions: {
          link: link || '/'
        }
      }
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      ...message
    })

    console.log(`✅ Successfully sent: ${response.successCount}`)
    console.log(`❌ Failed: ${response.failureCount}`)

    const invalidTokens = []
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const error = resp.error
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          invalidTokens.push(tokens[idx])
        }
      }
    })

    if (invalidTokens.length > 0) {
      console.log(`🗑️ Removing ${invalidTokens.length} invalid tokens`)
      const batch = db.batch()
      for (const token of invalidTokens) {
        const tokenDoc = db.collection('fcmTokens').doc(token)
        batch.delete(tokenDoc)
      }
      await batch.commit()
    }

    await db.collection('notificationHistory').add({
      title,
      body,
      link: link || '/',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      successCount: response.successCount,
      failureCount: response.failureCount
    })
    console.log('✅ Notification history saved')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Notification sent successfully',
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokensRemoved: invalidTokens.length
      })
    }
  } catch (error) {
    console.error('❌ Error sending notification:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send notification',
        details: error.message
      })
    }
  }
}
