import { useState, useEffect } from 'react'
import { FileText, Save, RotateCcw } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'

const AdminSiteContent = () => {
  const [content, setContent] = useState({
    hero: {
      title: 'בית המדרש "חזון יוסף"',
      subtitle: 'שיכון ג\' והסביבה',
      address: 'בעל התניא 26, בני ברק'
    },
    about: {
      title: 'אודות בית המדרש',
      paragraph1: 'בית המדרש "חזון יוסף" משמש כמרכז רוחני לקהילת שיכון ג\' והסביבה בבני ברק. אנו מציעים תפילות במניינים קבועים, שיעורי תורה מגוונים, ואווירה חמה ומזמינה לכל המבקשים להתקרב לתורה ולעבודת ה\'.',
      paragraph2: 'בית המדרש נקרא על שם הרב יוסף זצ"ל, ומשמש כמקום מפגש לתלמידי חכמים, אברכים ובעלי בתים המבקשים לעסוק בתורה ובתפילה באווירה של קדושה ויראת שמים.'
    },
    features: {
      title: 'מה אנו מציעים',
      items: [
        {
          id: 1,
          title: 'תפילות במניין',
          description: 'מניינים קבועים לשחרית, מנחה וערבית בזמנים נוחים לכל הציבור',
          icon: 'clock'
        },
        {
          id: 2,
          title: 'שיעורי תורה',
          description: 'שיעורים מגוונים בגמרא, הלכה, מוסר ומחשבה על ידי מגידי שיעורים מובילים',
          icon: 'book'
        },
        {
          id: 3,
          title: 'קהילה חמה',
          description: 'אווירה משפחתית ומזמינה, קהילה תומכת ומגובשת של אנשים יראי שמים',
          icon: 'users'
        },
        {
          id: 4,
          title: 'אירועים מיוחדים',
          description: 'סיומי מסכת, מסיבות מצווה, וערבי עיון מיוחדים לחגים ומועדים',
          icon: 'heart'
        },
        {
          id: 5,
          title: 'מתקנים מודרניים',
          description: 'בית מדרש מרווח ומאובזר, ספריית קודש עשירה, ומערכת הגברה איכותית',
          icon: 'image'
        },
        {
          id: 6,
          title: 'עדכונים שוטפים',
          description: 'הצטרפו לרשימת התפוצה שלנו לקבלת עדכונים על שיעורים, אירועים וזמני תפילה',
          icon: 'mail'
        }
      ]
    },
    cta: {
      title: 'הצטרפו אלינו',
      description: 'אנו מזמינים אתכם להצטרף לקהילה שלנו, להשתתף בתפילות ובשיעורים, ולהיות חלק ממשפחת "חזון יוסף"'
    },
    quickLinks: {
      title: 'גישה מהירה'
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
      console.log('📥 Loading site content via Netlify Function...')
      const data = await fetchFromFirebase('firebase-site-content')
      
      if (data.content) {
        console.log('✅ Site content loaded:', data.content)
        setContent(data.content)
        localStorage.setItem('siteContent', JSON.stringify(data.content))
      }
    } catch (error) {
      console.error('❌ Error loading site content:', error)
      const saved = localStorage.getItem('siteContent')
      if (saved) {
        console.log('📦 Loaded from localStorage fallback')
        setContent(JSON.parse(saved))
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    console.log('💾 Saving site content via Netlify Function...', content)
    
    try {
      await saveToFirebase('firebase-site-content', { content })
      
      localStorage.setItem('siteContent', JSON.stringify(content))
      setMessage('✅ התוכן נשמר בהצלחה!')
      setHasChanges(false)
      console.log('✅ Site content saved successfully')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving site content:', error)
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

  const updateFeatureItem = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      <div className="card overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <FileText className="text-primary-600" size={32} />
            ניהול תוכן האתר
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

        {/* Hero Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">סקציית Hero (כותרת ראשית)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת ראשית</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) => updateContent('hero', 'title', e.target.value)}
                className="input-field"
                placeholder='בית המדרש "חזון יוסף"'
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת משנה</label>
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                className="input-field"
                placeholder="שיכון ג' והסביבה"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">כתובת</label>
              <input
                type="text"
                value={content.hero.address}
                onChange={(e) => updateContent('hero', 'address', e.target.value)}
                className="input-field"
                placeholder="בעל התניא 26, בני ברק"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">אודות בית המדרש</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת</label>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) => updateContent('about', 'title', e.target.value)}
                className="input-field"
                placeholder="אודות בית המדרש"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">פסקה ראשונה</label>
              <textarea
                value={content.about.paragraph1}
                onChange={(e) => updateContent('about', 'paragraph1', e.target.value)}
                className="input-field resize-none"
                rows="4"
                placeholder="תיאור בית המדרש..."
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">פסקה שנייה</label>
              <textarea
                value={content.about.paragraph2}
                onChange={(e) => updateContent('about', 'paragraph2', e.target.value)}
                className="input-field resize-none"
                rows="4"
                placeholder="תיאור נוסף..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">מה אנו מציעים</h3>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת</label>
              <input
                type="text"
                value={content.features.title}
                onChange={(e) => updateContent('features', 'title', e.target.value)}
                className="input-field"
                placeholder="מה אנו מציעים"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            {content.features.items.map((item, index) => (
              <div key={item.id} className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3">פריט {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-600 text-sm font-medium mb-1">כותרת</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateFeatureItem(index, 'title', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-sm font-medium mb-1">תיאור</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateFeatureItem(index, 'description', e.target.value)}
                      className="input-field resize-none"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">הצטרפו אלינו (Call to Action)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת</label>
              <input
                type="text"
                value={content.cta.title}
                onChange={(e) => updateContent('cta', 'title', e.target.value)}
                className="input-field"
                placeholder="הצטרפו אלינו"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">תיאור</label>
              <textarea
                value={content.cta.description}
                onChange={(e) => updateContent('cta', 'description', e.target.value)}
                className="input-field resize-none"
                rows="3"
                placeholder="טקסט הזמנה..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">גישה מהירה</h3>
          <div>
            <label className="block text-slate-700 font-medium mb-2">כותרת</label>
            <input
              type="text"
              value={content.quickLinks.title}
              onChange={(e) => updateContent('quickLinks', 'title', e.target.value)}
              className="input-field"
              placeholder="גישה מהירה"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSiteContent
