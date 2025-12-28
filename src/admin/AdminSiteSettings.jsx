import { useState, useEffect } from 'react'
import { Settings, Save, RotateCcw, Palette, Type } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'
import ColorPicker from '../components/ColorPicker'
import AccessibilityChecker from '../components/AccessibilityChecker'
import ColorPresetManager from '../components/ColorPresetManager'
import { applyColorsToCSS } from '../utils/colorUtils'
import { AVAILABLE_FONTS, applyFont } from '../utils/fontUtils'
import { applyGradient, applyButtonGradient } from '../utils/gradientUtils'
import { GRADIENT_PRESETS } from '../utils/gradientPresets'

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
    gradient: {
      enabled: false,
      colors: ['#1e3a8a', '#4c1d95', '#7c3aed'],
      direction: 'to right'
    },
    buttonGradient: {
      enabled: false,
      colors: ['#4f46e5', '#7c3aed'],
      direction: 'to right'
    },
    font: 'Assistant',
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (settings.colors) {
      applyColorsToCSS(settings.colors)
    }
  }, [settings.colors])

  useEffect(() => {
    if (settings.font) {
      applyFont(settings.font)
    }
  }, [settings.font])

  useEffect(() => {
    if (settings.gradient) {
      applyGradient(settings.gradient)
    }
  }, [settings.gradient])

  useEffect(() => {
    if (settings.buttonGradient) {
      applyButtonGradient(settings.buttonGradient)
    }
  }, [settings.buttonGradient])

  const loadSettings = async () => {
    // First, load from localStorage synchronously to prevent flash
    const saved = localStorage.getItem('siteSettings')
    if (saved) {
      try {
        const cachedSettings = JSON.parse(saved)
        console.log('🎨 Loading settings from localStorage (sync)')
        setSettings(cachedSettings)
        if (cachedSettings.colors) {
          applyColorsToCSS(cachedSettings.colors)
        }
        if (cachedSettings.font) {
          applyFont(cachedSettings.font)
        }
        if (cachedSettings.gradient) {
          applyGradient(cachedSettings.gradient)
        }
        if (cachedSettings.buttonGradient) {
          applyButtonGradient(cachedSettings.buttonGradient)
        }
      } catch (error) {
        console.error('Error parsing localStorage settings:', error)
      }
    }
    
    // Mark as loaded so UI can render
    setLoading(false)
    
    // Then fetch from Firebase in the background
    try {
      console.log('📥 Loading site settings from Firebase...')
      const data = await fetchFromFirebase('firebase-settings')
      
      if (data.settings) {
        console.log('✅ Site settings loaded from Firebase:', data.settings)
        setSettings(data.settings)
        localStorage.setItem('siteSettings', JSON.stringify(data.settings))
        if (data.settings.colors) {
          applyColorsToCSS(data.settings.colors)
        }
        if (data.settings.font) {
          applyFont(data.settings.font)
        }
        if (data.settings.gradient) {
          applyGradient(data.settings.gradient)
        }
        if (data.settings.buttonGradient) {
          applyButtonGradient(data.settings.buttonGradient)
        }
      }
    } catch (error) {
      console.error('❌ Error loading site settings from Firebase:', error)
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

  const updateGradient = (field, value) => {
    setSettings(prev => ({
      ...prev,
      gradient: {
        ...prev.gradient,
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateButtonGradient = (field, value) => {
    setSettings(prev => ({
      ...prev,
      buttonGradient: {
        ...prev.buttonGradient,
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const applyGradientPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      gradient: {
        ...prev.gradient,
        colors: preset.background.colors,
        direction: preset.background.direction
      },
      buttonGradient: {
        ...prev.buttonGradient,
        colors: preset.button.colors,
        direction: preset.button.direction
      }
    }))
    setHasChanges(true)
    setMessage(`✨ תבנית "${preset.name}" הוחלה בהצלחה!`)
    setTimeout(() => setMessage(''), 3000)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-x-hidden max-w-full">
      <div className="card overflow-x-hidden">
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

        {/* Font Settings */}
        <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Type className="text-primary-600" size={28} />
            בחירת גופן לאתר
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              ✨ <strong>בחר גופן:</strong> כל הגופנים תומכים בעברית ויוחלו באופן מיידי על כל האתר.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_FONTS.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, font: font.name }))
                    setHasChanges(true)
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-right ${
                    settings.font === font.name
                      ? 'border-primary-600 bg-primary-50 shadow-md'
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{font.name}</span>
                    {settings.font === font.name && (
                      <span className="text-primary-600 text-xl">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{font.category}</p>
                  <p className="text-base" style={{ fontFamily: font.value }}>
                    דוגמה: בית המדרש חזון יוסף
                  </p>
                  <p className="text-sm mt-1" style={{ fontFamily: font.value }}>
                    ABCabc 123
                  </p>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-3">תצוגה מקדימה של הגופן הנבחר:</h4>
              <div 
                className="p-6 bg-white rounded-lg border-2 border-primary-200"
                style={{ fontFamily: AVAILABLE_FONTS.find(f => f.name === settings.font)?.value }}
              >
                <h1 className="text-3xl font-bold mb-3">בית המדרש "חזון יוסף"</h1>
                <h2 className="text-2xl font-semibold mb-3">שיכון ג' בני ברק</h2>
                <p className="text-lg mb-2">
                  ברוכים הבאים לבית המדרש שלנו. כאן תוכלו למצוא מידע על זמני תפילות, שיעורים ואירועים.
                </p>
                <p className="text-base">
                  English text: Welcome to our Beit Midrash. Here you can find information about prayer times, classes and events.
                </p>
              </div>
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

        {/* Gradient Background Settings */}
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Palette className="text-purple-600" size={28} />
            רקע גרדיאנט (מעבר צבעים)
          </h3>
          
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800 text-sm">
                ✨ <strong>אפקט גרדיאנט:</strong> הוסף מעבר צבעים יפהפה לרקע האתר. השינויים יוחלו באופן מיידי!
              </p>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-bold text-slate-800">הפעל רקע גרדיאנט</h4>
                <p className="text-sm text-slate-600">הצג מעבר צבעים ברקע האתר</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.gradient?.enabled || false}
                  onChange={(e) => updateGradient('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {settings.gradient?.enabled && (
              <div className="space-y-6 animate-fade-in">
                {/* Gradient Presets */}
                <div className="border-2 border-purple-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-white">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-purple-600" />
                    תבניות מוכנות
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">בחר תבנית מעוצבת והחל אותה על הרקע והכפתורים בלחיצה אחת</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyGradientPreset(preset)}
                        className="group relative overflow-hidden rounded-lg border-2 border-slate-200 hover:border-purple-400 transition-all hover:scale-105 hover:shadow-lg"
                        title={preset.description}
                      >
                        <div
                          className="h-24 w-full"
                          style={{
                            background: `linear-gradient(${preset.background.direction}, ${preset.background.colors.join(', ')})`
                          }}
                        ></div>
                        <div className="p-2 bg-white">
                          <p className="text-sm font-bold text-slate-800 text-center">{preset.name}</p>
                          <p className="text-xs text-slate-500 text-center">{preset.description}</p>
                        </div>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      💡 <strong>טיפ:</strong> לחיצה על תבנית תחליף את הצבעים של הרקע והכפתורים. אל תשכח לשמור!
                    </p>
                  </div>
                </div>

                {/* Multiple Colors */}
                <div>
                  <label className="block text-slate-700 font-bold mb-3">צבעי הגרדיאנט</label>
                  <p className="text-sm text-slate-600 mb-4">הוסף עד 4 צבעים למעבר חלק ומרשים</p>
                  
                  {(settings.gradient?.colors || ['#1e3a8a', '#4c1d95', '#7c3aed']).map((color, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-medium text-slate-700 w-20">צבע {index + 1}</span>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...(settings.gradient?.colors || ['#1e3a8a', '#4c1d95', '#7c3aed'])]
                          newColors[index] = e.target.value
                          updateGradient('colors', newColors)
                        }}
                        className="w-20 h-12 rounded-lg border-2 border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...(settings.gradient?.colors || ['#1e3a8a', '#4c1d95', '#7c3aed'])]
                          newColors[index] = e.target.value
                          updateGradient('colors', newColors)
                        }}
                        className="input-field flex-1"
                        placeholder="#1e3a8a"
                      />
                      {(settings.gradient?.colors || []).length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newColors = (settings.gradient?.colors || []).filter((_, i) => i !== index)
                            updateGradient('colors', newColors)
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {(settings.gradient?.colors || []).length < 4 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newColors = [...(settings.gradient?.colors || ['#1e3a8a', '#4c1d95', '#7c3aed']), '#ec4899']
                        updateGradient('colors', newColors)
                      }}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      + הוסף צבע
                    </button>
                  )}
                </div>

                {/* Direction */}
                <div>
                  <label className="block text-slate-700 font-bold mb-3">כיוון הגרדיאנט</label>
                  <select
                    value={settings.gradient?.direction || 'to right'}
                    onChange={(e) => updateGradient('direction', e.target.value)}
                    className="input-field"
                  >
                    <option value="to right">שמאל לימין ←</option>
                    <option value="to left">ימין לשמאל →</option>
                    <option value="to bottom">למעלה למטה ↓</option>
                    <option value="to top">למטה למעלה ↑</option>
                    <option value="to bottom right">אלכסון ↘</option>
                    <option value="to bottom left">אלכסון ↙</option>
                    <option value="to top right">אלכסון ↗</option>
                    <option value="to top left">אלכסון ↖</option>
                  </select>
                </div>

                {/* Preview */}
                <div className="border-2 border-purple-300 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-slate-800 mb-4">תצוגה מקדימה</h4>
                  <div
                    className="w-full h-40 rounded-lg shadow-lg"
                    style={{
                      background: `linear-gradient(${settings.gradient?.direction || 'to right'}, ${(settings.gradient?.colors || ['#1e3a8a', '#4c1d95', '#7c3aed']).join(', ')})`
                    }}
                  ></div>
                  <p className="text-sm text-slate-600 mt-3 text-center">
                    כך ייראה הרקע באתר
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Button Gradient Settings */}
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Palette className="text-blue-600" size={28} />
            גרדיאנט לכפתורים
          </h3>
          
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                ✨ <strong>גרדיאנט לכפתורים:</strong> הוסף מעבר צבעים מיוחד לכפתורים באתר. יוחל על כל הכפתורים הראשיים.
              </p>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-bold text-slate-800">הפעל גרדיאנט לכפתורים</h4>
                <p className="text-sm text-slate-600">החל מעבר צבעים על כל הכפתורים באתר</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.buttonGradient?.enabled || false}
                  onChange={(e) => updateButtonGradient('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.buttonGradient?.enabled && (
              <div className="space-y-6 animate-fade-in">
                {/* Multiple Colors */}
                <div>
                  <label className="block text-slate-700 font-bold mb-3">צבעי הגרדיאנט</label>
                  <p className="text-sm text-slate-600 mb-4">בחר 2-3 צבעים למעבר חלק בכפתורים</p>
                  
                  {(settings.buttonGradient?.colors || ['#4f46e5', '#7c3aed']).map((color, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-medium text-slate-700 w-20">צבע {index + 1}</span>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...(settings.buttonGradient?.colors || ['#4f46e5', '#7c3aed'])]
                          newColors[index] = e.target.value
                          updateButtonGradient('colors', newColors)
                        }}
                        className="w-20 h-12 rounded-lg border-2 border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...(settings.buttonGradient?.colors || ['#4f46e5', '#7c3aed'])]
                          newColors[index] = e.target.value
                          updateButtonGradient('colors', newColors)
                        }}
                        className="input-field flex-1"
                        placeholder="#4f46e5"
                      />
                      {(settings.buttonGradient?.colors || []).length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newColors = (settings.buttonGradient?.colors || []).filter((_, i) => i !== index)
                            updateButtonGradient('colors', newColors)
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {(settings.buttonGradient?.colors || []).length < 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newColors = [...(settings.buttonGradient?.colors || ['#4f46e5', '#7c3aed']), '#ec4899']
                        updateButtonGradient('colors', newColors)
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      + הוסף צבע
                    </button>
                  )}
                </div>

                {/* Direction */}
                <div>
                  <label className="block text-slate-700 font-bold mb-3">כיוון הגרדיאנט</label>
                  <select
                    value={settings.buttonGradient?.direction || 'to right'}
                    onChange={(e) => updateButtonGradient('direction', e.target.value)}
                    className="input-field"
                  >
                    <option value="to right">שמאל לימין ←</option>
                    <option value="to left">ימין לשמאל →</option>
                    <option value="to bottom">למעלה למטה ↓</option>
                    <option value="to top">למטה למעלה ↑</option>
                    <option value="to bottom right">אלכסון ↘</option>
                    <option value="to bottom left">אלכסון ↙</option>
                    <option value="to top right">אלכסון ↗</option>
                    <option value="to top left">אלכסון ↖</option>
                  </select>
                </div>

                {/* Preview */}
                <div className="border-2 border-blue-300 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-slate-800 mb-4">תצוגה מקדימה</h4>
                  <button
                    type="button"
                    className="w-full py-4 px-6 rounded-lg shadow-lg text-white font-bold text-lg"
                    style={{
                      background: `linear-gradient(${settings.buttonGradient?.direction || 'to right'}, ${(settings.buttonGradient?.colors || ['#4f46e5', '#7c3aed']).join(', ')})`
                    }}
                  >
                    כפתור לדוגמה
                  </button>
                  <p className="text-sm text-slate-600 mt-3 text-center">
                    כך ייראו הכפתורים באתר
                  </p>
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
