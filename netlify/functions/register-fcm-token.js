const admin = require('firebase-admin')

if (!admin.apps.length) {
  try {
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
    const { token, userAgent, platform } = JSON.parse(event.body)

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token is required' })
      }
    }

    const db = admin.firestore()
    
    await db.collection('fcmTokens').doc(token).set({
      token,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: userAgent || 'unknown',
      platform: platform || 'unknown'
    }, { merge: true })

    console.log('✅ FCM token registered:', token.substring(0, 20) + '...')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Token registered successfully'
      })
    }
  } catch (error) {
    console.error('❌ Error registering token:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to register token',
        details: error.message
      })
    }
  }
}
