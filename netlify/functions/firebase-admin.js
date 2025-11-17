// Firebase Admin SDK initialization
import admin from 'firebase-admin'

let firebaseApp = null

export const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp
  }

  try {
    // Initialize Firebase Admin with service account from environment variables
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

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    })

    console.log('✅ Firebase Admin initialized successfully')
    return firebaseApp
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error)
    throw error
  }
}

export const getFirestore = () => {
  if (!firebaseApp) {
    initializeFirebase()
  }
  return admin.firestore()
}

export const verifyAuth = (context) => {
  const user = context?.clientContext?.user
  
  if (!user) {
    console.log('❌ No authenticated user found')
    return { authenticated: false, user: null }
  }

  console.log('✅ User authenticated:', user.email)
  return { authenticated: true, user }
}
