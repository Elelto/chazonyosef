importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

let messaging = null

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const firebaseConfig = event.data.config
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
      console.log('✅ Firebase initialized in SW with config from main app')
      
      messaging = firebase.messaging()
      
      messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message:', payload)
        
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

        self.registration.showNotification(notificationTitle, notificationOptions)
      })
    }
  }
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
