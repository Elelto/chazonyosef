import { useState, useEffect } from 'react'
import { Settings, Save, RotateCcw, Palette } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'
import ColorPicker from '../components/ColorPicker'
import AccessibilityChecker from '../components/AccessibilityChecker'
import ColorPresetManager from '../components/ColorPresetManager'
import { applyColorsToCSS } from '../utils/colorUtils'

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
  const [showColorSection, setShowColorSection] = useState('editor')

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (settings.colors) {
      applyColorsToCSS(settings.colors)
    }
  }, [settings.colors])

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

  const updateColor = (colorType, value) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }))
    setHasChanges(true)
  }

  const applyPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent
      }
    }))
    setHasChanges(true)
    setMessage('✨ ערכת הצבעים הוחלה בהצלחה!')
    setTimeout(() => setMessage(''), 3000)
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
        <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Palette className="text-primary-600" size={28} />
              מערכת ניהול צבעים מתקדמת
            </h3>
            <div className="flex gap-2 border-2 border-slate-300 rounded-lg p-1 bg-white">
              <button
                type="button"
                onClick={() => setShowColorSection('editor')}
                className={`px-4 py-2 rounded-md transition-all font-medium ${
                  showColorSection === 'editor'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                עורך צבעים
              </button>
              <button
                type="button"
                onClick={() => setShowColorSection('presets')}
                className={`px-4 py-2 rounded-md transition-all font-medium ${
                  showColorSection === 'presets'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ערכות מוכנות
              </button>
              <button
                type="button"
                onClick={() => setShowColorSection('accessibility')}
                className={`px-4 py-2 rounded-md transition-all font-medium ${
                  showColorSection === 'accessibility'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                בדיקת נגישות
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            {showColorSection === 'editor' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    ✨ <strong>מערכת מתקדמת:</strong> בחר צבעים עם תצוגה מקדימה חיה, גנרטור גוונים אוטומטי ובדיקות נגישות.
                    השינויים יוחלו באופן מיידי!
                  </p>
                </div>

                <ColorPicker
                  label="צבע ראשי (Primary)"
                  value={settings.colors.primary}
                  onChange={(value) => updateColor('primary', value)}
                  showShades={true}
                  showPreview={true}
                  showAccessibility={true}
                />

                <div className="border-t-2 border-slate-200 my-6"></div>

                <ColorPicker
                  label="צבע משני (Secondary)"
                  value={settings.colors.secondary}
                  onChange={(value) => updateColor('secondary', value)}
                  showShades={true}
                  showPreview={true}
                  showAccessibility={true}
                />

                <div className="border-t-2 border-slate-200 my-6"></div>

                <ColorPicker
                  label="צבע הדגשה (Accent)"
                  value={settings.colors.accent}
                  onChange={(value) => updateColor('accent', value)}
                  showShades={true}
                  showPreview={true}
                  showAccessibility={true}
                />

                <div className="border-t-2 border-slate-200 my-6"></div>

                {/* Combined Preview */}
                <div className="border-2 border-primary-200 rounded-lg p-6 bg-gradient-to-br from-white to-slate-50">
                  <h4 className="text-lg font-bold text-slate-800 mb-4">תצוגה מקדימה משולבת</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-600">צבע ראשי</p>
                      <button
                        type="button"
                        className="w-full px-4 py-3 rounded-lg font-medium text-white"
                        style={{ backgroundColor: settings.colors.primary }}
                      >
                        כפתור ראשי
                      </button>
                      <div
                        className="w-full px-4 py-2 rounded-lg text-center font-medium"
                        style={{ backgroundColor: settings.colors.primary + '20', color: settings.colors.primary }}
                      >
                        תג צבעוני
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-600">צבע משני</p>
                      <button
                        type="button"
                        className="w-full px-4 py-3 rounded-lg font-medium text-white"
                        style={{ backgroundColor: settings.colors.secondary }}
                      >
                        כפתור משני
                      </button>
                      <div
                        className="w-full px-4 py-2 rounded-lg text-center font-medium"
                        style={{ backgroundColor: settings.colors.secondary + '20', color: settings.colors.secondary }}
                      >
                        תג צבעוני
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-600">צבע הדגשה</p>
                      <button
                        type="button"
                        className="w-full px-4 py-3 rounded-lg font-medium text-white"
                        style={{ backgroundColor: settings.colors.accent }}
                      >
                        כפתור הדגשה
                      </button>
                      <div
                        className="w-full px-4 py-2 rounded-lg text-center font-medium"
                        style={{ backgroundColor: settings.colors.accent + '20', color: settings.colors.accent }}
                      >
                        תג צבעוני
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showColorSection === 'presets' && (
              <div className="animate-fade-in">
                <ColorPresetManager
                  currentColors={settings.colors}
                  onApplyPreset={applyPreset}
                />
              </div>
            )}

            {showColorSection === 'accessibility' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>בדיקת נגישות WCAG 2.1:</strong> ודא שהצבעים שלך עומדים בתקני נגישות בינלאומיים.
                    AA = רמה בסיסית, AAA = רמה מתקדמת.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-4">צבע ראשי</h4>
                    <AccessibilityChecker foreground={settings.colors.primary} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-4">צבע משני</h4>
                    <AccessibilityChecker foreground={settings.colors.secondary} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-4">צבע הדגשה</h4>
                    <AccessibilityChecker foreground={settings.colors.accent} />
                  </div>
                </div>
              </div>
            )}
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
