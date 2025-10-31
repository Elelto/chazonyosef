import { useState, useEffect } from 'react'
import { Clock, Save, Plus, Trash2 } from 'lucide-react'

const AdminPrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState({
    weekday: {
      shacharit: ['06:30', '07:30', '08:15'],
      mincha: ['13:30', '14:15'],
      arvit: ['20:00', '21:00']
    },
    shabbat: {
      friday: {
        mincha: '18:30',
        candleLighting: '19:15'
      },
      saturday: {
        shacharit: '08:30',
        mincha: '19:00',
        arvit: '20:15',
        shabbatEnds: '20:25'
      }
    }
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrayerTimes()
  }, [])

  const loadPrayerTimes = async () => {
    try {
      console.log('📥 Loading prayer times from server...')
      
      // Check if user is logged in
      const user = window.netlifyIdentity?.currentUser()
      console.log('👤 Current user:', user?.email || 'Not logged in')
      
      const response = await fetch('/.netlify/functions/prayer-times')
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Prayer times loaded:', data)
        setPrayerTimes(data)
      } else {
        console.warn('⚠️ Failed to load from server, trying localStorage')
        const saved = localStorage.getItem('prayerTimes')
        if (saved) {
          setPrayerTimes(JSON.parse(saved))
        }
      }
    } catch (error) {
      console.error('❌ Error loading prayer times:', error)
      setMessage('שגיאה בטעינת זמני התפילות')
    } finally {
      setLoading(false)
    }
  }

  const handleWeekdayTimeChange = (prayer, index, value) => {
    const newTimes = { ...prayerTimes }
    newTimes.weekday[prayer][index] = value
    setPrayerTimes(newTimes)
  }

  const addWeekdayTime = (prayer) => {
    const newTimes = { ...prayerTimes }
    newTimes.weekday[prayer].push('00:00')
    setPrayerTimes(newTimes)
  }

  const removeWeekdayTime = (prayer, index) => {
    const newTimes = { ...prayerTimes }
    newTimes.weekday[prayer].splice(index, 1)
    setPrayerTimes(newTimes)
  }

  const handleShabbatTimeChange = (day, field, value) => {
    const newTimes = { ...prayerTimes }
    newTimes.shabbat[day][field] = value
    setPrayerTimes(newTimes)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    console.log('💾 Saving prayer times to server...', prayerTimes)
    
    try {
      // Get current user and token
      const user = window.netlifyIdentity?.currentUser()
      const token = user?.token?.access_token
      
      console.log('🔑 Auth info:', {
        hasUser: !!user,
        email: user?.email,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
      })

      const headers = {
        'Content-Type': 'application/json'
      }

      // Add authorization header if we have a token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        console.log('✅ Authorization header added')
      } else {
        console.warn('⚠️ No token found - request will be unauthorized')
      }

      const response = await fetch('/.netlify/functions/prayer-times', {
        method: 'POST',
        headers,
        body: JSON.stringify(prayerTimes)
      })

      console.log('📡 Server response:', response.status, response.statusText)
      const result = await response.json()
      console.log('📦 Result:', result)

      if (response.ok) {
        localStorage.setItem('prayerTimes', JSON.stringify(prayerTimes))
        setMessage('✅ הזמנים נשמרו בהצלחה בשרת!')
        console.log('✅ Prayer times saved successfully')
      } else {
        console.error('❌ Server error:', result)
        setMessage(`שגיאה: ${result.error || 'לא ניתן לשמור'}`)
      }
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving prayer times:', error)
      setMessage('שגיאה בשמירת הזמנים - בדוק את החיבור לשרת')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Clock className="text-primary-600" size={32} />
            עריכת זמני תפילות
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {message}
          </div>
        )}

        {/* Weekday Times */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">ימי חול</h3>
          
          {/* Shacharit */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-slate-700">שחרית</label>
              <button
                onClick={() => addWeekdayTime('shacharit')}
                className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
                הוסף מניין
              </button>
            </div>
            <div className="space-y-2">
              {prayerTimes.weekday.shacharit.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleWeekdayTimeChange('shacharit', index, e.target.value)}
                    className="input-field"
                  />
                  {prayerTimes.weekday.shacharit.length > 1 && (
                    <button
                      onClick={() => removeWeekdayTime('shacharit', index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mincha */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-slate-700">מנחה</label>
              <button
                onClick={() => addWeekdayTime('mincha')}
                className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
                הוסף מניין
              </button>
            </div>
            <div className="space-y-2">
              {prayerTimes.weekday.mincha.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleWeekdayTimeChange('mincha', index, e.target.value)}
                    className="input-field"
                  />
                  {prayerTimes.weekday.mincha.length > 1 && (
                    <button
                      onClick={() => removeWeekdayTime('mincha', index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Arvit */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-slate-700">ערבית</label>
              <button
                onClick={() => addWeekdayTime('arvit')}
                className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
                הוסף מניין
              </button>
            </div>
            <div className="space-y-2">
              {prayerTimes.weekday.arvit.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleWeekdayTimeChange('arvit', index, e.target.value)}
                    className="input-field"
                  />
                  {prayerTimes.weekday.arvit.length > 1 && (
                    <button
                      onClick={() => removeWeekdayTime('arvit', index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shabbat Times */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">שבת קודש</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Friday */}
            <div>
              <h4 className="font-medium text-slate-700 mb-3">ערב שבת</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">מנחה</label>
                  <input
                    type="time"
                    value={prayerTimes.shabbat.friday.mincha}
                    onChange={(e) => handleShabbatTimeChange('friday', 'mincha', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">הדלקת נרות</label>
                  <input
                    type="time"
                    value={prayerTimes.shabbat.friday.candleLighting}
                    onChange={(e) => handleShabbatTimeChange('friday', 'candleLighting', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div>
              <h4 className="font-medium text-slate-700 mb-3">יום שבת</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">שחרית</label>
                  <input
                    type="time"
                    value={prayerTimes.shabbat.saturday.shacharit}
                    onChange={(e) => handleShabbatTimeChange('saturday', 'shacharit', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">מנחה</label>
                  <input
                    type="time"
                    value={prayerTimes.shabbat.saturday.mincha}
                    onChange={(e) => handleShabbatTimeChange('saturday', 'mincha', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">ערבית</label>
                  <input
                    type="time"
                    value={prayerTimes.shabbat.saturday.arvit}
                    onChange={(e) => handleShabbatTimeChange('saturday', 'arvit', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">צאת השבת</label>
                  <input
                    type="time"
                    value={prayerTimes.shabbat.saturday.shabbatEnds}
                    onChange={(e) => handleShabbatTimeChange('saturday', 'shabbatEnds', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPrayerTimes
