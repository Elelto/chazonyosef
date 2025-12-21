// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, isSupported } from 'firebase/messaging'

// Firebase configuration - API key from environment variable for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chazon-e3dc4.firebaseapp.com",
  projectId: "chazon-e3dc4",
  storageBucket: "chazon-e3dc4.firebasestorage.app",
  messagingSenderId: "553870721683",
  appId: "1:553870721683:web:e24bc7d0a90e8752df0366",
  measurementId: "G-C9BJRBDLPG"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Enable offline persistence for Firestore (only in production/HTTPS)
if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('✅ Firestore offline persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Firestore persistence not supported by browser');
      } else {
        console.error('❌ Firestore persistence error:', err);
      }
    });
} else {
  console.log('ℹ️ Firestore offline persistence disabled in development');
}

// Initialize Storage
export const storage = getStorage(app)

// Initialize Messaging (only in supported browsers)
let messaging = null
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      messaging = getMessaging(app)
      console.log('✅ Firebase Messaging initialized')
    } else {
      console.log('ℹ️ Firebase Messaging not supported in this browser')
    }
  }).catch(err => {
    console.warn('⚠️ Firebase Messaging check failed:', err)
  })
}

export { messaging }
export default app
