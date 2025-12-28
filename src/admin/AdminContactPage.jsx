import { useState, useEffect } from 'react'
import { Phone, Save, RotateCcw } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'

const AdminContactPage = () => {
  const [content, setContent] = useState({
    header: {
      title: 'צור קשר',
      subtitle: 'נשמח לשמוע ממך! צור איתנו קשר בכל שאלה, הצעה או בקשה'
    },
    contactInfo: {
      title: 'פרטי התקשרות',
      address: {
        street: 'בעל התניא 26',
        city: 'בני ברק',
        country: 'ישראל',
        mapLink: 'https://www.google.com/maps/search/?api=1&query=בעל+התניא+26+בני+ברק',
        mapLinkText: 'פתח ב-Google Maps →'
      },
      phone: {
        number: '***-***-****',
        display: '***-***-****'
      },
      email: {
        address: '***@***.com',
        display: '***@***.com'
      },
      hours: {
        weekdays: 'ימי חול: 6:00 - 22:00',
        shabbat: 'שבת: לפי זמני התפילות'
      }
    },
    form: {
      title: 'שלח לנו הודעה',
      nameLabel: 'שם מלא',
      namePlaceholder: 'הכנס את שמך המלא',
      emailLabel: 'כתובת אימייל',
      emailPlaceholder: 'example@email.com',
      phoneLabel: 'מספר טלפון',
      phonePlaceholder: '050-1234567',
      messageLabel: 'הודעה',
      messagePlaceholder: 'כתוב את הודעתך כאן...',
      submitButton: 'שלח הודעה',
      submittingButton: 'שולח...',
      successMessage: 'ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.',
      errorMessage: 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.'
    },
    map: {
      title: 'מיקום',
      placeholder: 'מפה תתווסף בקרוב'
    }
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      console.log('📥 Loading contact page content...')
      const data = await fetchFromFirebase('firebase-contact-page')
      
      if (data.content) {
        console.log('✅ Contact page content loaded:', data.content)
        setContent(data.content)
        localStorage.setItem('contactPageContent', JSON.stringify(data.content))
      }
    } catch (error) {
      console.error('❌ Error loading contact page content:', error)
      const saved = localStorage.getItem('contactPageContent')
      if (saved) {
        console.log('📦 Loaded from localStorage fallback')
        setContent(JSON.parse(saved))
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    console.log('💾 Saving contact page content...', content)
    
    try {
      await saveToFirebase('firebase-contact-page', { content })
      
      localStorage.setItem('contactPageContent', JSON.stringify(content))
      setMessage('✅ תוכן דף יצירת הקשר נשמר בהצלחה!')
      setHasChanges(false)
      console.log('✅ Contact page content saved successfully')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving contact page content:', error)
      setMessage('שגיאה בשמירת התוכן: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל השינויים?')) {
      loadContent()
      setHasChanges(false)
      setMessage('השינויים אופסו')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateNestedContent = (section, subsection, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      <div className="card overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Phone className="text-primary-600" size={32} />
            ניהול דף יצירת קשר
          </h2>
          <div className="flex gap-2">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-300 hover:bg-slate-400 rounded-lg transition-colors flex items-center gap-2"
              >
                <RotateCcw size={18} />
                בטל שינויים
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="btn-primary disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">כותרת הדף</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת ראשית</label>
              <input
                type="text"
                value={content.header.title}
                onChange={(e) => updateContent('header', 'title', e.target.value)}
                className="input-field"
                placeholder="צור קשר"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת משנה</label>
              <textarea
                value={content.header.subtitle}
                onChange={(e) => updateContent('header', 'subtitle', e.target.value)}
                className="input-field resize-none"
                rows="2"
                placeholder="נשמח לשמוע ממך..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">פרטי התקשרות</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת סקציה</label>
              <input
                type="text"
                value={content.contactInfo.title}
                onChange={(e) => updateContent('contactInfo', 'title', e.target.value)}
                className="input-field"
                placeholder="פרטי התקשרות"
              />
            </div>

            {/* Address */}
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-3">כתובת</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">רחוב</label>
                  <input
                    type="text"
                    value={content.contactInfo.address.street}
                    onChange={(e) => updateNestedContent('contactInfo', 'address', 'street', e.target.value)}
                    className="input-field"
                    placeholder="בעל התניא 26"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">עיר</label>
                  <input
                    type="text"
                    value={content.contactInfo.address.city}
                    onChange={(e) => updateNestedContent('contactInfo', 'address', 'city', e.target.value)}
                    className="input-field"
                    placeholder="בני ברק"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">מדינה</label>
                  <input
                    type="text"
                    value={content.contactInfo.address.country}
                    onChange={(e) => updateNestedContent('contactInfo', 'address', 'country', e.target.value)}
                    className="input-field"
                    placeholder="ישראל"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">קישור למפה (Google Maps)</label>
                  <input
                    type="url"
                    value={content.contactInfo.address.mapLink}
                    onChange={(e) => updateNestedContent('contactInfo', 'address', 'mapLink', e.target.value)}
                    className="input-field"
                    placeholder="https://www.google.com/maps/..."
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">טקסט קישור למפה</label>
                  <input
                    type="text"
                    value={content.contactInfo.address.mapLinkText}
                    onChange={(e) => updateNestedContent('contactInfo', 'address', 'mapLinkText', e.target.value)}
                    className="input-field"
                    placeholder="פתח ב-Google Maps →"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-3">טלפון</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">מספר (לחיוג)</label>
                  <input
                    type="text"
                    value={content.contactInfo.phone.number}
                    onChange={(e) => updateNestedContent('contactInfo', 'phone', 'number', e.target.value)}
                    className="input-field"
                    placeholder="03-1234567"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">תצוגה</label>
                  <input
                    type="text"
                    value={content.contactInfo.phone.display}
                    onChange={(e) => updateNestedContent('contactInfo', 'phone', 'display', e.target.value)}
                    className="input-field"
                    placeholder="03-1234567"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-3">אימייל</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">כתובת (לשליחה)</label>
                  <input
                    type="email"
                    value={content.contactInfo.email.address}
                    onChange={(e) => updateNestedContent('contactInfo', 'email', 'address', e.target.value)}
                    className="input-field"
                    placeholder="info@example.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">תצוגה</label>
                  <input
                    type="text"
                    value={content.contactInfo.email.display}
                    onChange={(e) => updateNestedContent('contactInfo', 'email', 'display', e.target.value)}
                    className="input-field"
                    placeholder="info@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-3">שעות פעילות</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">ימי חול</label>
                  <input
                    type="text"
                    value={content.contactInfo.hours.weekdays}
                    onChange={(e) => updateNestedContent('contactInfo', 'hours', 'weekdays', e.target.value)}
                    className="input-field"
                    placeholder="ימי חול: 6:00 - 22:00"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1">שבת</label>
                  <input
                    type="text"
                    value={content.contactInfo.hours.shabbat}
                    onChange={(e) => updateNestedContent('contactInfo', 'hours', 'shabbat', e.target.value)}
                    className="input-field"
                    placeholder="שבת: לפי זמני התפילות"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">טופס יצירת קשר</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת טופס</label>
              <input
                type="text"
                value={content.form.title}
                onChange={(e) => updateNestedContent('form', 'title', e.target.value)}
                className="input-field"
                placeholder="שלח לנו הודעה"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2">תווית שדה שם</label>
                <input
                  type="text"
                  value={content.form.nameLabel}
                  onChange={(e) => updateNestedContent('form', 'nameLabel', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">Placeholder שדה שם</label>
                <input
                  type="text"
                  value={content.form.namePlaceholder}
                  onChange={(e) => updateNestedContent('form', 'namePlaceholder', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">טקסט כפתור שליחה</label>
              <input
                type="text"
                value={content.form.submitButton}
                onChange={(e) => updateNestedContent('form', 'submitButton', e.target.value)}
                className="input-field"
                placeholder="שלח הודעה"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">הודעת הצלחה</label>
              <textarea
                value={content.form.successMessage}
                onChange={(e) => updateNestedContent('form', 'successMessage', e.target.value)}
                className="input-field resize-none"
                rows="2"
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">הודעת שגיאה</label>
              <textarea
                value={content.form.errorMessage}
                onChange={(e) => updateNestedContent('form', 'errorMessage', e.target.value)}
                className="input-field resize-none"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">מפה</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת</label>
              <input
                type="text"
                value={content.map.title}
                onChange={(e) => updateNestedContent('map', 'title', e.target.value)}
                className="input-field"
                placeholder="מיקום"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">טקסט Placeholder</label>
              <input
                type="text"
                value={content.map.placeholder}
                onChange={(e) => updateNestedContent('map', 'placeholder', e.target.value)}
                className="input-field"
                placeholder="מפה תתווסף בקרוב"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminContactPage
