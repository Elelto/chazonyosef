import { useState, useEffect } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

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
      localStorage.setItem('notificationAsked', 'true')
      
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        await registerToken()
        setMessage('✅ הודעות הופעלו בהצלחה!')
      } else {
        setMessage('❌ הרשאות הודעות נדחו')
      }

      setShowPrompt(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error requesting permission:', error)
      setMessage('שגיאה בבקשת הרשאות')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const registerToken = async () => {
    try {
      // Send Firebase config to service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
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
      }

      const messaging = getMessaging()
      
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
      if (!vapidKey) {
        console.error('❌ VAPID key not found')
        return
      }

      const currentToken = await getToken(messaging, { vapidKey })
      
      if (currentToken) {
        console.log('✅ FCM Token:', currentToken)
        setToken(currentToken)
        localStorage.setItem('fcmToken', currentToken)

        await setDoc(doc(db, 'fcmTokens', currentToken), {
          token: currentToken,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          userAgent: navigator.userAgent,
          platform: navigator.platform
        }, { merge: true })

        setupMessageListener()
        
        console.log('✅ Token saved to Firestore')
      } else {
        console.warn('⚠️ No registration token available')
      }
    } catch (error) {
      console.error('❌ Error getting token:', error)
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    localStorage.setItem('notificationAsked', 'true')
  }

  if (!showPrompt && !message) return null

  return (
    <>
      {message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-white shadow-lg rounded-lg p-4 border border-slate-200">
            <p className="text-slate-800">{message}</p>
          </div>
        </div>
      )}

      {showPrompt && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 animate-slide-up">
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
    </>
  )
}

export default NotificationPermission
