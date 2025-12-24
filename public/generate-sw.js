// This script generates the firebase-messaging-sw.js with the API key from environment
// Run this during build: node public/generate-sw.js

const fs = require('fs');
const path = require('path');

const apiKey = process.env.VITE_FIREBASE_API_KEY;

if (!apiKey) {
  console.error('❌ VITE_FIREBASE_API_KEY not found in environment variables');
  process.exit(1);
}

const swContent = `importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

// Initialize Firebase immediately on SW load
const firebaseConfig = {
  apiKey: "${apiKey}",
  authDomain: "chazon-e3dc4.firebaseapp.com",
  projectId: "chazon-e3dc4",
  storageBucket: "chazon-e3dc4.firebasestorage.app",
  messagingSenderId: "553870721683",
  appId: "1:553870721683:web:e24bc7d0a90e8752df0366",
  measurementId: "G-C9BJRBDLPG"
}

firebase.initializeApp(firebaseConfig)
console.log('✅ Firebase initialized in SW on load')

const messaging = firebase.messaging()
console.log('✅ Firebase Messaging initialized in SW')

// Register background message handler immediately
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 [SW] Background message received!')
  console.log('📦 [SW] Full payload:', JSON.stringify(payload, null, 2))
  console.log('📧 [SW] Notification data:', payload.notification)
  console.log('📎 [SW] Custom data:', payload.data)
  
  const notificationTitle = payload.notification?.title || 'חזון יוסף'
  const notificationOptions = {
    body: payload.notification?.body || 'עדכון חדש',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    dir: 'rtl',
    lang: 'he',
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.link || '/'
    }
  }

  console.log('🔔 [SW] Showing notification:', notificationTitle, notificationOptions)
  
  return self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log('✅ [SW] Notification displayed successfully')
    })
    .catch(error => {
      console.error('❌ [SW] Error showing notification:', error)
    })
})

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event)
  
  event.notification.close()
  
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

console.log('[firebase-messaging-sw.js] Service Worker loaded')
`;

const outputPath = path.join(__dirname, 'firebase-messaging-sw.js');
fs.writeFileSync(outputPath, swContent);
console.log('✅ firebase-messaging-sw.js generated successfully');
