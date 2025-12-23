import { useState, useEffect } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const NotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission)
  const [showPrompt, setShowPrompt] = useState(false)
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const hasAsked = localStorage.getItem('notificationAsked')
    const hasToken = localStorage.getItem('fcmToken')
    
    if (!hasAsked && permission === 'default' && !hasToken) {
      setTimeout(() => setShowPrompt(true), 5000)
    }

    if (hasToken) {
      setToken(hasToken)
      setupMessageListener()
    }
  }, [])

  const setupMessageListener = () => {
    try {
      const messaging = getMessaging()
      onMessage(messaging, (payload) => {
        console.log('📩 Message received:', payload)
        
        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/icon-192.png',
            badge: '/icon-72.png',
            dir: 'rtl',
            lang: 'he'
          })
        }
      })
    } catch (error) {
      console.error('❌ Error setting up message listener:', error)
    }
  }

  const requestPermission = async () => {
    try {
      console.log('🔔 Requesting notification permission...')
      console.log('Current permission status:', Notification.permission)
      
      // Check if already blocked
      if (Notification.permission === 'denied') {
        console.warn('⚠️ Notifications already blocked')
        setMessage('❌ הודעות חסומות. לאפשור: לחץ על הנעילה ליד כתובת האתר ← הרשאות ← הודעות ← אפשר')
        setTimeout(() => setMessage(''), 6000)
        setShowPrompt(false)
        return
      }
      
      localStorage.setItem('notificationAsked', 'true')
      
      const result = await Notification.requestPermission()
      console.log('Permission result:', result)
      setPermission(result)

      if (result === 'granted') {
        await registerToken()
        setMessage('✅ הודעות הופעלו בהצלחה!')
      } else if (result === 'denied') {
        console.warn('⚠️ Notifications blocked by user')
        setMessage('❌ הודעות נחסמו. לאפשור: לחץ על הנעילה ליד כתובת האתר ← הרשאות ← הודעות ← אפשר')
      } else {
        console.warn('⚠️ Notification permission dismissed')
        setMessage('ℹ️ לא ניתנה הרשאה. נסה שוב מאוחר יותר')
      }

      setShowPrompt(false)
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      console.error('❌ Error requesting permission:', error)
      setMessage('שגיאה בבקשת הרשאות')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const registerToken = async () => {
    try {
      console.log('🔔 Starting FCM token registration...')
      
      // Send Firebase config to service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        console.log('✅ Service Worker ready')
        registration.active?.postMessage({
          type: 'FIREBASE_CONFIG',
          config: {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: "chazon-e3dc4.firebaseapp.com",
            projectId: "chazon-e3dc4",
            storageBucket: "chazon-e3dc4.firebasestorage.app",
            messagingSenderId: "553870721683",
            appId: "1:553870721683:web:e24bc7d0a90e8752df0366"
          }
        })
        console.log('📤 Firebase config sent to Service Worker')
      }

      const messaging = getMessaging()
      console.log('✅ Firebase Messaging instance obtained')
      
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
      if (!vapidKey) {
        console.error('❌ VAPID key not found in environment variables')
        setMessage('❌ שגיאה: מפתח VAPID חסר')
        setTimeout(() => setMessage(''), 3000)
        return
      }
      console.log('✅ VAPID key found:', vapidKey.substring(0, 20) + '...')

      console.log('🔄 Requesting FCM token...')
      const currentToken = await getToken(messaging, { vapidKey })
      
      if (currentToken) {
        console.log('✅ FCM Token received:', currentToken.substring(0, 30) + '...')
        setToken(currentToken)
        localStorage.setItem('fcmToken', currentToken)
        console.log('💾 Token saved to localStorage')

        console.log('📤 Sending token to backend...')
        const response = await fetch('/.netlify/functions/register-fcm-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: currentToken,
            userAgent: navigator.userAgent,
            platform: navigator.platform
          })
        })

        const responseData = await response.json()
        console.log('📥 Backend response:', responseData)

        if (response.ok) {
          console.log('✅ Token successfully saved to Firestore!')
        } else {
          console.error('❌ Failed to save token to Firestore:', responseData)
          setMessage('❌ שגיאה בשמירת הטוקן')
          setTimeout(() => setMessage(''), 3000)
        }

        setupMessageListener()
      } else {
        console.warn('⚠️ No registration token available - check browser support')
        setMessage('⚠️ הדפדפן לא תומך בהודעות Push')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('❌ Error in registerToken:', error)
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code
      })
      setMessage('❌ שגיאה ברישום להודעות')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    localStorage.setItem('notificationAsked', 'true')
  }

  // Show permanent button if notifications are not granted
  const showPermanentButton = permission !== 'granted' && !showPrompt && !message

  if (!showPrompt && !message && !showPermanentButton) return null

  return (
    <>
      {message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in max-w-md mx-4">
          <div className={`shadow-lg rounded-lg p-4 border ${
            message.includes('✅') 
              ? 'bg-green-50 border-green-200'
              : message.includes('❌')
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm ${
              message.includes('✅') 
                ? 'text-green-800'
                : message.includes('❌')
                ? 'text-red-800'
                : 'text-blue-800'
            }`}>{message}</p>
          </div>
        </div>
      )}

      {showPrompt && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[9999] animate-slide-up">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-lg shadow-2xl p-6">
            <button
              onClick={dismissPrompt}
              className="absolute top-3 left-3 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Bell size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">קבל עדכונים חשובים</h3>
                <p className="text-white/90 text-sm mb-4">
                  הפעל הודעות כדי לקבל עדכונים על שיעורים, אירועים וזמני תפילה
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={requestPermission}
                    className="flex-1 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bell size={18} />
                    הפעל הודעות
                  </button>
                  <button
                    onClick={dismissPrompt}
                    className="px-4 py-2 text-white/90 hover:text-white transition-colors"
                  >
                    לא עכשיו
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPermanentButton && (
        <button
          onClick={() => setShowPrompt(true)}
          className="fixed bottom-32 left-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-30 md:left-auto md:right-4 group"
          title="הירשם להודעות Push"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            קבל עדכונים חשובים
          </span>
        </button>
      )}
    </>
  )
}

export default NotificationPermission
