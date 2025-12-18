// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

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

// Initialize Storage
export const storage = getStorage(app)

export default app
