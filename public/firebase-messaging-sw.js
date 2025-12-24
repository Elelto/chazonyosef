importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

console.log('[SW] Service Worker script loaded')

// Listen for push events directly (this is the key fix!)
self.addEventListener('push', (event) => {
  console.log('🔔 [SW] Push event received!')
  
  if (!event.data) {
    console.warn('⚠️ [SW] Push event has no data')
    return
  }

  try {
    const payload = event.data.json()
    console.log('📦 [SW] Push payload:', JSON.stringify(payload, null, 2))
    
    const notificationTitle = payload.notification?.title || 'חזון יוסף'
    const notificationOptions = {
      body: payload.notification?.body || 'עדכון חדש',
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      dir: 'rtl',
      lang: 'he',
      vibrate: [200, 100, 200],
      data: {
        url: payload.data?.link || payload.fcmOptions?.link || '/'
      }
    }

    console.log('🔔 [SW] Showing notification:', notificationTitle)
    
    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
          console.log('✅ [SW] Notification displayed successfully')
        })
        .catch(error => {
          console.error('❌ [SW] Error showing notification:', error)
        })
    )
  } catch (error) {
    console.error('❌ [SW] Error parsing push data:', error)
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
