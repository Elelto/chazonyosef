import { useState, useEffect } from 'react'
import { Settings, Save, RotateCcw } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'

const AdminSiteSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'בית המדרש "חזון יוסף"',
      siteDescription: 'בית מדרש לתורה ותפילה בשיכון ג\' והסביבה, בני ברק',
      logoUrl: '/logo.png'
    },
    seo: {
      metaTitle: 'בית המדרש חזון יוסף - שיכון ג\' בני ברק',
      metaDescription: 'בית מדרש לתורה ותפילה המשרת את קהילת שיכון ג\' והסביבה בבני ברק. שיעורי תורה, תפילות במניין ואירועים מיוחדים.',
      keywords: 'בית מדרש, חזון יוסף, בני ברק, שיכון ג, תפילות, שיעורי תורה'
    },
    colors: {
      primary: '#4f46e5',
      secondary: '#0d9488',
      accent: '#d97706'
    },
    social: {
      facebook: '',
      whatsapp: '',
      youtube: '',
      instagram: ''
    }
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      console.log('📥 Loading site settings...')
      const data = await fetchFromFirebase('firebase-settings')
      
      if (data.settings) {
        console.log('✅ Site settings loaded:', data.settings)
        setSettings(data.settings)
        localStorage.setItem('siteSettings', JSON.stringify(data.settings))
      }
    } catch (error) {
      console.error('❌ Error loading site settings:', error)
      const saved = localStorage.getItem('siteSettings')
      if (saved) {
        console.log('📦 Loaded from localStorage fallback')
        setSettings(JSON.parse(saved))
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    console.log('💾 Saving site settings...', settings)
    
    try {
      await saveToFirebase('firebase-settings', { settings })
      
      localStorage.setItem('siteSettings', JSON.stringify(settings))
      setMessage('✅ ההגדרות נשמרו בהצלחה!')
      setHasChanges(false)
      console.log('✅ Site settings saved successfully')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving site settings:', error)
      setMessage('שגיאה בשמירת ההגדרות: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל השינויים?')) {
      loadSettings()
      setHasChanges(false)
      setMessage('השינויים אופסו')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const updateSettings = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Settings className="text-primary-600" size={32} />
            הגדרות כלליות של האתר
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

        {/* General Settings */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">הגדרות כלליות</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">שם האתר</label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                className="input-field"
                placeholder='בית המדרש "חזון יוסף"'
              />
              <p className="text-sm text-slate-500 mt-1">יופיע בכותרת הדפדפן ובתוצאות חיפוש</p>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">תיאור האתר</label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                className="input-field resize-none"
                rows="3"
                placeholder="תיאור קצר של האתר..."
              ></textarea>
              <p className="text-sm text-slate-500 mt-1">תיאור כללי לשימוש פנימי</p>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">נתיב ללוגו</label>
              <input
                type="text"
                value={settings.general.logoUrl}
                onChange={(e) => updateSettings('general', 'logoUrl', e.target.value)}
                className="input-field"
                placeholder="/logo.png"
              />
              <p className="text-sm text-slate-500 mt-1">נתיב לקובץ הלוגו (יחסי או מלא)</p>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">הגדרות SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת Meta (Title)</label>
              <input
                type="text"
                value={settings.seo.metaTitle}
                onChange={(e) => updateSettings('seo', 'metaTitle', e.target.value)}
                className="input-field"
                placeholder="בית המדרש חזון יוסף - שיכון ג' בני ברק"
              />
              <p className="text-sm text-slate-500 mt-1">מקסימום 60 תווים - יופיע בתוצאות Google</p>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">תיאור Meta (Description)</label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => updateSettings('seo', 'metaDescription', e.target.value)}
                className="input-field resize-none"
                rows="3"
                placeholder="תיאור האתר למנועי חיפוש..."
              ></textarea>
              <p className="text-sm text-slate-500 mt-1">מקסימום 160 תווים - יופיע מתחת לכותרת ב-Google</p>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">מילות מפתח (Keywords)</label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) => updateSettings('seo', 'keywords', e.target.value)}
                className="input-field"
                placeholder="בית מדרש, חזון יוסף, בני ברק..."
              />
              <p className="text-sm text-slate-500 mt-1">הפרד מילות מפתח בפסיקים</p>
            </div>
          </div>
        </div>

        {/* Color Settings */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">ערכת צבעים</h3>
          <p className="text-sm text-slate-600 mb-4">
            ⚠️ שינוי צבעים דורש עדכון קוד CSS - תכונה זו לעתיד
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 pointer-events-none">
            <div>
              <label className="block text-slate-700 font-medium mb-2">צבע ראשי (Primary)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.colors.primary}
                  onChange={(e) => updateSettings('colors', 'primary', e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                  disabled
                />
                <input
                  type="text"
                  value={settings.colors.primary}
                  onChange={(e) => updateSettings('colors', 'primary', e.target.value)}
                  className="input-field flex-1"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">צבע משני (Secondary)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.colors.secondary}
                  onChange={(e) => updateSettings('colors', 'secondary', e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                  disabled
                />
                <input
                  type="text"
                  value={settings.colors.secondary}
                  onChange={(e) => updateSettings('colors', 'secondary', e.target.value)}
                  className="input-field flex-1"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">צבע הדגשה (Accent)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.colors.accent}
                  onChange={(e) => updateSettings('colors', 'accent', e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                  disabled
                />
                <input
                  type="text"
                  value={settings.colors.accent}
                  onChange={(e) => updateSettings('colors', 'accent', e.target.value)}
                  className="input-field flex-1"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">רשתות חברתיות</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">Facebook</label>
              <input
                type="url"
                value={settings.social.facebook}
                onChange={(e) => updateSettings('social', 'facebook', e.target.value)}
                className="input-field"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">WhatsApp (קבוצה/ערוץ)</label>
              <input
                type="url"
                value={settings.social.whatsapp}
                onChange={(e) => updateSettings('social', 'whatsapp', e.target.value)}
                className="input-field"
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">YouTube</label>
              <input
                type="url"
                value={settings.social.youtube}
                onChange={(e) => updateSettings('social', 'youtube', e.target.value)}
                className="input-field"
                placeholder="https://youtube.com/@..."
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">Instagram</label>
              <input
                type="url"
                value={settings.social.instagram}
                onChange={(e) => updateSettings('social', 'instagram', e.target.value)}
                className="input-field"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSiteSettings
