import { useState, useEffect } from 'react'
import { Clock, Sunrise, Sunset, Moon, Sun } from 'lucide-react'

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrayerTimes()
  }, [])

  const fetchPrayerTimes = async () => {
    try {
      console.log('📥 Fetching prayer times from Netlify Function...')
      const response = await fetch('/.netlify/functions/firebase-prayer-times')
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times')
      }
      
      const data = await response.json()
      console.log('✅ Prayer times loaded:', data)
      setPrayerTimes(data)
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching prayer times:', error)
      // Fallback to localStorage if available
      const saved = localStorage.getItem('prayerTimes')
      if (saved) {
        console.log('📦 Using cached prayer times')
        setPrayerTimes(JSON.parse(saved))
      }
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!prayerTimes) {
    return (
      <div className="py-12 animate-fade-in">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="section-title">זמני תפילות</h1>
            <p className="section-subtitle mb-8">
              זמני התפילות בבית המדרש "חזון יוסף"
            </p>
            <div className="card max-w-md mx-auto">
              <Clock className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <p className="text-lg text-slate-600">
                זמני התפילות יעודכנו בקרוב
              </p>
              <p className="text-sm text-slate-500 mt-2">
                לפרטים נוספים ניתן ליצור קשר עם בית המדרש
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 animate-fade-in">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">זמני תפילות</h1>
          <p className="section-subtitle">
            זמני התפילות בבית המדרש "חזון יוסף" - מעודכנים באופן שוטף
          </p>
        </div>

        {/* Weekday Times */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Sun className="text-gold-500" size={32} />
            ימי חול
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shacharit */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Sunrise className="text-primary-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">שחרית</h3>
              </div>
              <div className="space-y-2">
                {prayerTimes.weekday.shacharit.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="font-medium text-slate-700">מניין {index + 1}</span>
                    <span className="text-2xl font-bold text-primary-600">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mincha */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gold-100 p-3 rounded-lg">
                  <Sun className="text-gold-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">מנחה</h3>
              </div>
              <div className="space-y-2">
                {prayerTimes.weekday.mincha.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="font-medium text-slate-700">מניין {index + 1}</span>
                    <span className="text-2xl font-bold text-gold-600">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arvit */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Moon className="text-primary-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">ערבית</h3>
              </div>
              <div className="space-y-2">
                {prayerTimes.weekday.arvit.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="font-medium text-slate-700">מניין {index + 1}</span>
                    <span className="text-2xl font-bold text-primary-600">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shabbat Times */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Clock className="text-primary-500" size={32} />
            שבת קודש
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Friday */}
            <div className="card bg-gradient-to-br from-gold-50 to-gold-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4">ערב שבת</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-slate-700">מנחה</span>
                  <span className="text-2xl font-bold text-gold-600">
                    {prayerTimes.shabbat.friday.mincha}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-slate-700">הדלקת נרות</span>
                  <span className="text-2xl font-bold text-gold-600">
                    {prayerTimes.shabbat.friday.candleLighting}
                  </span>
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4">יום שבת</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-slate-700">שחרית</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {prayerTimes.shabbat.saturday.shacharit}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-slate-700">מנחה</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {prayerTimes.shabbat.saturday.mincha}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-slate-700">ערבית</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {prayerTimes.shabbat.saturday.arvit}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-slate-700">צאת השבת</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {prayerTimes.shabbat.saturday.shabbatEnds}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Events */}
        {prayerTimes.special && prayerTimes.special.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Clock className="text-gold-500" size={32} />
              שיעורים ואירועים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prayerTimes.special.map((event, index) => (
                <div key={index} className="card hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">{event.days}</span>
                    <span className="text-xl font-bold text-primary-600">
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mt-12 p-6 bg-primary-50 border-r-4 border-primary-500 rounded-lg">
          <p className="text-slate-700">
            <strong>שימו לב:</strong> זמני התפילה עשויים להשתנות בהתאם לעונות השנה ולחגים.
            לעדכונים שוטפים, הצטרפו לרשימת התפוצה שלנו או צרו איתנו קשר.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrayerTimes
