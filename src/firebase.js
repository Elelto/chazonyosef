// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase Web API Key - safe for public use
// This key is automatically restricted to Firebase-related APIs only
const firebaseConfig = {
  apiKey: "AIzaSyCahm3Mr6eM4j0XACPDexiHCI7fq0wlI_E",
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

export default app
