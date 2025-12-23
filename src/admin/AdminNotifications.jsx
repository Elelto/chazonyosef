import { useState, useEffect } from 'react'
import { Bell, Send, History, Trash2, Users } from 'lucide-react'
import { collection, query, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase'

const AdminNotifications = () => {
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    link: ''
  })
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    loadHistory()
    loadSubscriberCount()
  }, [])

  const loadHistory = async () => {
    try {
      const q = query(
        collection(db, 'notificationHistory'),
        orderBy('sentAt', 'desc'),
        limit(10)
      )
      const snapshot = await getDocs(q)
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setHistory(historyData)
    } catch (error) {
      console.error('❌ Error loading history:', error)
    }
  }

  const loadSubscriberCount = async () => {
    try {
      const snapshot = await getCountFromServer(collection(db, 'fcmTokens'))
      setSubscriberCount(snapshot.data().count)
    } catch (error) {
      console.error('❌ Error loading subscriber count:', error)
    }
  }

  const handleSend = async () => {
    if (!notification.title || !notification.body) {
      setMessage('❌ נא למלא כותרת ותוכן')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setSending(true)
    setMessage('📤 שולח הודעה...')

    try {
      const response = await fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notification.title,
          body: notification.body,
          link: notification.link || '/'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ההודעה נשלחה ל-${data.successCount} מנויים!`)
        setNotification({ title: '', body: '', link: '' })
        loadHistory()
      } else {
        setMessage(`❌ שגיאה: ${data.error}`)
      }
    } catch (error) {
      console.error('❌ Error sending notification:', error)
      setMessage('❌ שגיאה בשליחת ההודעה')
    } finally {
      setSending(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'לא ידוע'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Bell className="text-primary-600" size={32} />
            שליחת הודעות Push
          </h2>
          <div className="flex items-center gap-2 text-slate-600">
            <Users size={20} />
            <span className="font-medium">{subscriberCount} מנויים</span>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.includes('📤')
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Send size={20} />
            הודעה חדשה
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת *</label>
              <input
                type="text"
                value={notification.title}
                onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                className="input-field"
                placeholder="לדוגמה: שיעור חדש היום"
                maxLength={50}
              />
              <p className="text-sm text-slate-500 mt-1">{notification.title.length}/50 תווים</p>
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">תוכן ההודעה *</label>
              <textarea
                value={notification.body}
                onChange={(e) => setNotification({ ...notification, body: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="לדוגמה: הרב כהן ישמש שיעור בהלכות שבת בשעה 20:00"
                maxLength={150}
              ></textarea>
              <p className="text-sm text-slate-500 mt-1">{notification.body.length}/150 תווים</p>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">קישור (אופציונלי)</label>
              <input
                type="text"
                value={notification.link}
                onChange={(e) => setNotification({ ...notification, link: e.target.value })}
                className="input-field"
                placeholder="לדוגמה: /events או https://..."
              />
              <p className="text-sm text-slate-500 mt-1">המשתמש יועבר לקישור זה בלחיצה על ההודעה</p>
            </div>

            <button
              onClick={handleSend}
              disabled={sending || !notification.title || !notification.body}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
            >
              <Send size={18} />
              {sending ? 'שולח...' : `שלח לכל המנויים (${subscriberCount})`}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <History size={20} />
            היסטוריית הודעות ({history.length})
          </h3>
          
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="mx-auto mb-3 opacity-50" size={48} />
              <p>עדיין לא נשלחו הודעות</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <span className="text-xs text-slate-500">
                      {formatDate(item.sentAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">{item.body}</p>
                  {item.link && (
                    <p className="text-xs text-primary-600 mb-2">🔗 {item.link}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      ✅ {item.successCount || 0} נשלחו
                    </span>
                    {item.failureCount > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        ❌ {item.failureCount} נכשלו
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          💡 טיפים לשליחת הודעות
        </h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• <strong>כותרת קצרה וברורה</strong> - עד 50 תווים</li>
          <li>• <strong>תוכן ממוקד</strong> - עד 150 תווים</li>
          <li>• <strong>הוסף קישור</strong> - כדי להוביל למידע נוסף</li>
          <li>• <strong>שלח בזמן מתאים</strong> - לא מאוחר מדי בלילה</li>
          <li>• <strong>תדירות סבירה</strong> - לא יותר מדי הודעות ביום</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminNotifications
