// Test function to debug Firebase Admin initialization
export const handler = async (event, context) => {
  console.log('🔍 Testing Firebase Admin Configuration...')
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // Check environment variables
    const envCheck = {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY_ID: !!process.env.FIREBASE_PRIVATE_KEY_ID,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_CLIENT_ID: !!process.env.FIREBASE_CLIENT_ID,
    }

    console.log('Environment variables check:', envCheck)

    // Check values (partial for security)
    const values = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30) || 'missing',
      hasNewlines: process.env.FIREBASE_PRIVATE_KEY?.includes('\\n') || false,
    }

    console.log('Values check:', values)

    // Try to initialize Firebase Admin
    const admin = await import('firebase-admin')
    
    let app
    try {
      // Check if already initialized
      app = admin.app()
      console.log('✅ Firebase Admin already initialized')
    } catch (e) {
      console.log('Initializing Firebase Admin...')
      
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
      }

      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      })
      
      console.log('✅ Firebase Admin initialized successfully')
    }

    // Try to access Firestore
    const db = admin.firestore()
    console.log('✅ Firestore instance created')

    // Try a simple read
    const testDoc = await db.collection('settings').doc('prayerTimes').get()
    console.log('✅ Test read successful, doc exists:', testDoc.exists)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Firebase Admin is working correctly!',
        envCheck,
        values: {
          projectId: values.projectId,
          clientEmail: values.clientEmail,
          privateKeyLength: values.privateKeyLength,
          hasNewlines: values.hasNewlines
        },
        testRead: {
          exists: testDoc.exists,
          hasData: testDoc.exists ? !!testDoc.data() : false
        }
      }, null, 2)
    }

  } catch (error) {
    console.error('❌ ERROR:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        name: error.name
      }, null, 2)
    }
  }
}
