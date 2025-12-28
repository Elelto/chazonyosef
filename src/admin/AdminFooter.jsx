import { useState, useEffect } from 'react'
import { Layout, Save, RotateCcw } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'

const AdminFooter = () => {
  const [content, setContent] = useState({
    about: {
      title: 'בית המדרש "חזון יוסף"',
      description: 'בית מדרש לתורה ותפילה המשרת את קהילת שיכון ג\' והסביבה בבני ברק. מזמינים אתכם להצטרף לשיעורים ולתפילות.'
    },
    contact: {
      address: 'בעל התניא 26',
      city: 'בני ברק',
      phone: '***-***-****',
      email: '***@***.com'
    },
    prayerTimes: {
      title: 'זמני תפילה',
      shacharit: '6:30, 7:30',
      mincha: '13:30',
      arvit: '20:00',
      linkText: 'לזמנים מלאים →'
    },
    copyright: {
      text: 'בית המדרש "חזון יוסף". כל הזכויות שמורות.',
      subtext: 'פותח באהבה עבור קהילת שיכון ג\' והסביבה'
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
      console.log('📥 Loading footer content...')
      const data = await fetchFromFirebase('firebase-footer')
      
      if (data.content) {
        console.log('✅ Footer content loaded:', data.content)
        setContent(data.content)
        localStorage.setItem('footerContent', JSON.stringify(data.content))
      }
    } catch (error) {
      console.error('❌ Error loading footer content:', error)
      const saved = localStorage.getItem('footerContent')
      if (saved) {
        console.log('📦 Loaded from localStorage fallback')
        setContent(JSON.parse(saved))
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    console.log('💾 Saving footer content...', content)
    
    try {
      await saveToFirebase('firebase-footer', { content })
      
      localStorage.setItem('footerContent', JSON.stringify(content))
      setMessage('✅ תוכן הפוטר נשמר בהצלחה!')
      setHasChanges(false)
      console.log('✅ Footer content saved successfully')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving footer content:', error)
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

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      <div className="card overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Layout className="text-primary-600" size={32} />
            ניהול תוכן הפוטר
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

        {/* About Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">אודות (עמודה ראשונה)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת</label>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) => updateContent('about', 'title', e.target.value)}
                className="input-field"
                placeholder='בית המדרש "חזון יוסף"'
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">תיאור</label>
              <textarea
                value={content.about.description}
                onChange={(e) => updateContent('about', 'description', e.target.value)}
                className="input-field resize-none"
                rows="4"
                placeholder="תיאור קצר של בית המדרש..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">פרטי התקשרות</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2">כתובת - רחוב</label>
                <input
                  type="text"
                  value={content.contact.address}
                  onChange={(e) => updateContent('contact', 'address', e.target.value)}
                  className="input-field"
                  placeholder="בעל התניא 26"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">עיר</label>
                <input
                  type="text"
                  value={content.contact.city}
                  onChange={(e) => updateContent('contact', 'city', e.target.value)}
                  className="input-field"
                  placeholder="בני ברק"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2">טלפון</label>
                <input
                  type="text"
                  value={content.contact.phone}
                  onChange={(e) => updateContent('contact', 'phone', e.target.value)}
                  className="input-field"
                  placeholder="03-1234567"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">אימייל</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => updateContent('contact', 'email', e.target.value)}
                  className="input-field"
                  placeholder="info@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Times */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">זמני תפילה (תצוגה מקוצרת)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת</label>
              <input
                type="text"
                value={content.prayerTimes.title}
                onChange={(e) => updateContent('prayerTimes', 'title', e.target.value)}
                className="input-field"
                placeholder="זמני תפילה"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2">שחרית</label>
                <input
                  type="text"
                  value={content.prayerTimes.shacharit}
                  onChange={(e) => updateContent('prayerTimes', 'shacharit', e.target.value)}
                  className="input-field"
                  placeholder="6:30, 7:30"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">מנחה</label>
                <input
                  type="text"
                  value={content.prayerTimes.mincha}
                  onChange={(e) => updateContent('prayerTimes', 'mincha', e.target.value)}
                  className="input-field"
                  placeholder="13:30"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">ערבית</label>
                <input
                  type="text"
                  value={content.prayerTimes.arvit}
                  onChange={(e) => updateContent('prayerTimes', 'arvit', e.target.value)}
                  className="input-field"
                  placeholder="20:00"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">טקסט קישור</label>
              <input
                type="text"
                value={content.prayerTimes.linkText}
                onChange={(e) => updateContent('prayerTimes', 'linkText', e.target.value)}
                className="input-field"
                placeholder="לזמנים מלאים →"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">זכויות יוצרים (שורה תחתונה)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">טקסט ראשי</label>
              <input
                type="text"
                value={content.copyright.text}
                onChange={(e) => updateContent('copyright', 'text', e.target.value)}
                className="input-field"
                placeholder='בית המדרש "חזון יוסף". כל הזכויות שמורות.'
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">טקסט משני</label>
              <input
                type="text"
                value={content.copyright.subtext}
                onChange={(e) => updateContent('copyright', 'subtext', e.target.value)}
                className="input-field"
                placeholder="פותח באהבה עבור קהילת שיכון ג' והסביבה"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFooter
