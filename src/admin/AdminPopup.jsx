import { useState, useEffect, useRef } from 'react'
import { Bell, Save, Eye, AlertTriangle, Info, X, Upload, FileText, Trash2 } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase, uploadFile } from '../utils/api'

const AdminPopup = () => {
  const [popup, setPopup] = useState({
    isActive: false,
    title: '',
    message: '',
    buttonText: 'סגור',
    actionUrl: '', // URL to open when button is clicked (optional)
    type: 'default', // default, warning, info
    id: Date.now().toString() // Used to track unique popups for "don't show again" logic
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  // Ref for file input
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadPopupSettings()
  }, [])

  const loadPopupSettings = async () => {
    try {
      console.log('📥 Loading popup settings...')
      const data = await fetchFromFirebase('firebase-popup')
      
      if (data && data.popup) {
        setPopup(prev => ({ ...prev, ...data.popup }))
      }
    } catch (error) {
      console.error('❌ Error loading popup settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setMessage('❌ נא להעלות קובץ PDF בלבד')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit for Firebase Storage
      setMessage('❌ הקובץ גדול מדי (מקסימום 5MB)')
      return
    }

    setUploading(true)
    setMessage('⏳ מעלה קובץ...')

    try {
      const result = await uploadFile(file)
      setPopup(prev => ({ ...prev, actionUrl: result.url }))
      setMessage('✅ הקובץ הועלה בהצלחה! אל תשכח לשמור.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error uploading file:', error)
      setMessage('❌ שגיאה בהעלאת הקובץ: ' + error.message)
    } finally {
      setUploading(false)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    // If we're activating a new popup or changing content significantly, 
    // we might want to update the ID so users see it again
    const popupToSave = {
      ...popup,
      // Ensure ID exists
      id: popup.id || Date.now().toString()
    }

    try {
      await saveToFirebase('firebase-popup', { popup: popupToSave })
      setMessage('✅ הגדרות המודעה נשמרו בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving popup:', error)
      setMessage('שגיאה בשמירה: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const generateNewId = () => {
    setPopup(prev => ({ ...prev, id: Date.now().toString() }))
    setMessage('🆔 נוצר מזהה חדש (המודעה תופיע מחדש לכל המשתמשים)')
    setTimeout(() => setMessage(''), 3000)
  }

  // Preview Component
  const PreviewModal = () => {
    if (!showPreview) return null

    const getIcon = () => {
      switch (popup.type) {
        case 'warning': return <AlertTriangle size={32} className="text-red-500" />
        case 'info': return <Info size={32} className="text-blue-500" />
        default: return <Bell size={32} className="text-gold-500" />
      }
    }

    const getThemeClasses = () => {
      switch (popup.type) {
        case 'warning': return 'border-red-500 bg-red-50'
        case 'info': return 'border-blue-500 bg-blue-50'
        default: return 'border-gold-500 bg-gold-50'
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className={`relative w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border-t-4 ${getThemeClasses()}`}>
          <div className="absolute top-0 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded-bl">תצוגה מקדימה</div>
          <button 
            onClick={() => setShowPreview(false)}
            className="absolute top-3 left-3 p-1 rounded-full hover:bg-black/10 transition-colors text-slate-500"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
              {getIcon()}
            </div>
            
            {popup.title && (
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {popup.title}
              </h3>
            )}
            
            {popup.message && (
              <div className="text-slate-600 mb-4 whitespace-pre-wrap">
                {popup.message}
              </div>
            )}

            {popup.actionUrl && (
              <div className="mb-6 w-full">
                {popup.actionUrl.endsWith('.pdf') || popup.actionUrl.startsWith('data:application/pdf') ? (
                  <div className="bg-slate-100 p-4 rounded-lg border-2 border-dashed border-slate-300">
                    <FileText size={48} className="mx-auto mb-2 text-slate-500" />
                    <p className="text-sm text-slate-600">קובץ PDF מצורף</p>
                  </div>
                ) : (
                  <img 
                    src={popup.actionUrl} 
                    alt={popup.title || 'תמונה'} 
                    className="w-full max-h-96 object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
              </div>
            )}

            <button
              onClick={() => setShowPreview(false)}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
                popup.type === 'warning' ? 'bg-red-500' :
                popup.type === 'info' ? 'bg-blue-500' :
                'bg-gold-500'
              }`}
            >
              {popup.buttonText || 'סגור'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PreviewModal />
      
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Bell className="text-primary-600" size={32} />
            ניהול מודעה מתפרצת (Pop-up)
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
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') || message.includes('🆔')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <span className="font-bold text-slate-700">סטטוס מודעה</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={popup.isActive}
                    onChange={(e) => setPopup({ ...popup, isActive: e.target.checked })}
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${
                    popup.isActive ? 'bg-green-500' : 'bg-slate-300'
                  }`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    popup.isActive ? 'transform translate-x-6' : ''
                  }`}></div>
                </div>
              </label>
              <p className="text-sm text-slate-500">
                כשהמודעה פעילה, היא תופיע לכל מבקר שנכנס לאתר בפעם הראשונה (בסשן הנוכחי).
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">סוג מודעה</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPopup({ ...popup, type: 'default' })}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    popup.type === 'default' 
                      ? 'border-gold-500 bg-gold-50 text-gold-700' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bell size={24} />
                  <span className="text-sm">רגיל</span>
                </button>
                <button
                  onClick={() => setPopup({ ...popup, type: 'warning' })}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    popup.type === 'warning' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle size={24} />
                  <span className="text-sm">אזהרה/חשוב</span>
                </button>
                <button
                  onClick={() => setPopup({ ...popup, type: 'info' })}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    popup.type === 'info' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Info size={24} />
                  <span className="text-sm">מידע</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת</label>
              <input
                type="text"
                value={popup.title}
                onChange={(e) => setPopup({ ...popup, title: e.target.value })}
                className="input-field"
                placeholder="למשל: שינוי בזמני התפילות"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">טקסט הכפתור</label>
              <input
                type="text"
                value={popup.buttonText}
                onChange={(e) => setPopup({ ...popup, buttonText: e.target.value })}
                className="input-field"
                placeholder="סגור"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">קישור לכפתור / קובץ PDF</label>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={popup.actionUrl || ''}
                  onChange={(e) => setPopup({ ...popup, actionUrl: e.target.value })}
                  className="input-field flex-grow"
                  placeholder="https://... או העלה קובץ"
                  dir="ltr"
                />
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="application/pdf"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed rounded-lg text-slate-700 flex items-center gap-2 whitespace-nowrap"
                  title="העלה PDF"
                >
                  <Upload size={18} />
                  <span>{uploading ? 'מעלה...' : 'העלה PDF'}</span>
                </button>

                {popup.actionUrl && (
                  <button
                    onClick={() => setPopup({ ...popup, actionUrl: '' })}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                    title="נקה קישור"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-slate-500 mt-1">
                ניתן להדביק קישור חיצוני או להעלות קובץ PDF (עד 5MB).
                <br />
                הקובץ יישמר ב-Firebase Storage והכפתור יפתח אותו בלשונית חדשה.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">תוכן ההודעה</label>
              <textarea
                value={popup.message}
                onChange={(e) => setPopup({ ...popup, message: e.target.value })}
                className="input-field h-40 resize-none"
                placeholder="כתוב כאן את תוכן ההודעה..."
              ></textarea>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">אפשרויות מתקדמות</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowPreview(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Eye size={18} />
                  תצוגה מקדימה
                </button>
                
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600 mb-2">
                    המודעה מוצגת למשתמשים פעם אחת בלבד. אם ערכת את המודעה ואתה רוצה שהיא תופיע שוב לכולם (גם למי שכבר סגר אותה), לחץ כאן:
                  </p>
                  <button 
                    onClick={generateNewId}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    אפס חשיפות (הצג מחדש לכולם)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPopup
