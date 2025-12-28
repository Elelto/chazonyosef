import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import { Bell, Save, Eye, AlertTriangle, Info, X, Upload, Trash2, Plus, Edit, List, Calendar } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase, uploadFile } from '../utils/api'

// Separate EditForm component to prevent recreation on parent re-renders
const EditForm = memo(({ 
  currentPopup, 
  setCurrentPopup, 
  editingIndex, 
  saving, 
  uploading, 
  message, 
  handleCancel, 
  handleSave, 
  handleFileSelect, 
  generateNewId, 
  fileInputRef, 
  setShowPreview 
}) => {
  if (!currentPopup) return null

  return (
    <div className="space-y-6 overflow-x-hidden max-w-full">
      <div className="card overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Bell className="text-primary-600" size={32} />
            {editingIndex !== null ? 'עריכת מודעה' : 'מודעה חדשה'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 flex items-center gap-2"
            >
              <X size={18} />
              ביטול
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? 'שומר...' : 'שמור'}
            </button>
          </div>
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
                    checked={currentPopup.isActive}
                    onChange={(e) => setCurrentPopup(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${
                    currentPopup.isActive ? 'bg-green-500' : 'bg-slate-300'
                  }`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    currentPopup.isActive ? 'transform translate-x-6' : ''
                  }`}></div>
                </div>
              </label>
              <p className="text-sm text-slate-500">
                כשהמודעה פעילה, היא תופיע למבקרים בהתאם לתזמון שהוגדר.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">סוג מודעה</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setCurrentPopup(prev => ({ ...prev, type: 'default' }))}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    currentPopup.type === 'default' 
                      ? 'border-gold-500 bg-gold-50 text-gold-700' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bell size={24} />
                  <span className="text-sm">רגיל</span>
                </button>
                <button
                  onClick={() => setCurrentPopup(prev => ({ ...prev, type: 'warning' }))}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    currentPopup.type === 'warning' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle size={24} />
                  <span className="text-sm">אזהרה</span>
                </button>
                <button
                  onClick={() => setCurrentPopup(prev => ({ ...prev, type: 'info' }))}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    currentPopup.type === 'info' 
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
                value={currentPopup.title}
                onChange={(e) => setCurrentPopup(prev => ({ ...prev, title: e.target.value }))}
                className="input-field w-full"
                placeholder="למשל: שינוי בזמני התפילות"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">טקסט הכפתור</label>
              <input
                type="text"
                value={currentPopup.buttonText}
                onChange={(e) => setCurrentPopup(prev => ({ ...prev, buttonText: e.target.value }))}
                className="input-field w-full"
                placeholder="סגור"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">קישור לכפתור / תמונה</label>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={currentPopup.actionUrl || ''}
                  onChange={(e) => setCurrentPopup(prev => ({ ...prev, actionUrl: e.target.value }))}
                  className="input-field flex-grow"
                  placeholder="https://... או העלה קובץ"
                  dir="ltr"
                />
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed rounded-lg text-slate-700 flex items-center gap-2 whitespace-nowrap"
                  title="העלה תמונה"
                >
                  <Upload size={18} />
                  <span>{uploading ? 'מעלה...' : 'העלה תמונה'}</span>
                </button>

                {currentPopup.actionUrl && (
                  <button
                    onClick={() => setCurrentPopup(prev => ({ ...prev, actionUrl: '' }))}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                    title="נקה קישור"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-slate-500 mt-1">
                ניתן להדביק קישור חיצוני או להעלות תמונה (עד 5MB).
                <br />
                התמונה תוצג בתוך המודעה. הכפתור יפתח את הקישור/תמונה בלשונית חדשה.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">תוכן ההודעה</label>
              <textarea
                value={currentPopup.message}
                onChange={(e) => setCurrentPopup(prev => ({ ...prev, message: e.target.value }))}
                className="input-field h-40 resize-none w-full"
                placeholder="כתוב כאן את תוכן ההודעה..."
              ></textarea>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-3">תזמון מודעה</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">תאריך התחלה</label>
                  <input
                    type="datetime-local"
                    value={currentPopup.startDate}
                    onChange={(e) => setCurrentPopup(prev => ({ ...prev, startDate: e.target.value }))}
                    className="input-field text-sm w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">השאר ריק להצגה מיידית</p>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">תאריך סיום</label>
                  <input
                    type="datetime-local"
                    value={currentPopup.endDate}
                    onChange={(e) => setCurrentPopup(prev => ({ ...prev, endDate: e.target.value }))}
                    className="input-field text-sm w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">השאר ריק ללא הגבלת זמן</p>
                </div>
              </div>
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
                    המודעה מוצגת למשתמשים פעם אחת בלבד. אם ערכת את המודעה ואתה רוצה שהיא תופיע שוב לכולם, לחץ כאן:
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
})

const AdminPopup = () => {
  const [popups, setPopups] = useState([])
  const [currentPopup, setCurrentPopup] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)
  
  const emptyPopup = {
    isActive: false,
    title: '',
    message: '',
    buttonText: 'סגור',
    actionUrl: '',
    type: 'default',
    id: Date.now().toString(),
    startDate: '',
    endDate: '',
    createdAt: new Date().toISOString()
  }

  useEffect(() => {
    loadPopupSettings()
  }, [])

  const loadPopupSettings = async () => {
    try {
      const data = await fetchFromFirebase('firebase-popup')
      
      if (data && data.popups) {
        setPopups(data.popups)
      } else if (data && data.popup) {
        setPopups([data.popup])
      }
    } catch (error) {
      console.error('❌ Error loading popup settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = useCallback(() => {
    setCurrentPopup({ ...emptyPopup, id: Date.now().toString(), createdAt: new Date().toISOString() })
    setEditingIndex(null)
    setViewMode('edit')
  }, [])

  const handleEdit = useCallback((index) => {
    setCurrentPopup({ ...popups[index] })
    setEditingIndex(index)
    setViewMode('edit')
  }, [popups])

  const handleDelete = async (index) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מודעה זו?')) return
    
    const newPopups = popups.filter((_, i) => i !== index)
    setPopups(newPopups)
    
    try {
      await saveToFirebase('firebase-popup', { popups: newPopups })
      setMessage('✅ המודעה נמחקה בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error deleting popup:', error)
      setMessage('❌ שגיאה במחיקת המודעה: ' + error.message)
    }
  }

  const handleCancel = useCallback(() => {
    setCurrentPopup(null)
    setEditingIndex(null)
    setViewMode('list')
  }, [])

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMessage('❌ נא להעלות תמונה בלבד (JPG, PNG, GIF, WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ הקובץ גדול מדי (מקסימום 5MB)')
      return
    }

    setUploading(true)
    setMessage('⏳ מעלה קובץ...')

    try {
      const result = await uploadFile(file)
      setCurrentPopup(prev => ({ ...prev, actionUrl: result.url }))
      setMessage('✅ הקובץ הועלה בהצלחה! אל תשכח לשמור.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error uploading file:', error)
      setMessage('❌ שגיאה בהעלאת הקובץ: ' + error.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSave = async () => {
    if (!currentPopup) return
    
    setSaving(true)
    
    const popupToSave = {
      ...currentPopup,
      id: currentPopup.id || Date.now().toString(),
      updatedAt: new Date().toISOString()
    }

    try {
      let newPopups
      if (editingIndex !== null) {
        newPopups = [...popups]
        newPopups[editingIndex] = popupToSave
      } else {
        newPopups = [...popups, popupToSave]
      }
      
      setPopups(newPopups)
      await saveToFirebase('firebase-popup', { popups: newPopups })
      setMessage('✅ המודעה נשמרה בהצלחה!')
      setTimeout(() => {
        setMessage('')
        handleCancel()
      }, 2000)
    } catch (error) {
      console.error('❌ Error saving popup:', error)
      setMessage('שגיאה בשמירה: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const generateNewId = useCallback(() => {
    setCurrentPopup(prev => ({ ...prev, id: Date.now().toString() }))
    setMessage('🆔 נוצר מזהה חדש (המודעה תופיע מחדש לכל המשתמשים)')
    setTimeout(() => setMessage(''), 3000)
  }, [])

  const getPopupStatus = (popup) => {
    if (!popup.isActive) return { text: 'לא פעילה', color: 'slate' }
    
    const now = new Date()
    const start = popup.startDate ? new Date(popup.startDate) : null
    const end = popup.endDate ? new Date(popup.endDate) : null
    
    if (start && now < start) return { text: 'ממתינה', color: 'orange' }
    if (end && now > end) return { text: 'הסתיימה', color: 'slate' }
    return { text: 'פעילה', color: 'green' }
  }

  // List View
  const ListView = () => (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      <div className="card overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Bell className="text-primary-600" size={32} />
            ניהול מודעות מתפרצות
          </h2>
          <button
            onClick={handleCreateNew}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            מודעה חדשה
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-slate-600">טוען מודעות...</p>
          </div>
        ) : popups.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <Bell size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 mb-4">אין מודעות במערכת</p>
            <button onClick={handleCreateNew} className="btn-primary">
              <Plus size={18} className="inline ml-2" />
              צור מודעה ראשונה
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {popups.map((popup, index) => {
              const status = getPopupStatus(popup)
              return (
                <div key={popup.id} className="card bg-white border-2 border-slate-200 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-800">
                          {popup.title || 'ללא כותרת'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-700`}>
                          {status.text}
                        </span>
                      </div>
                      
                      {popup.message && (
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{popup.message}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        {popup.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>התחלה: {new Date(popup.startDate).toLocaleDateString('he-IL')}</span>
                          </div>
                        )}
                        {popup.endDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>סיום: {new Date(popup.endDate).toLocaleDateString('he-IL')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                        title="ערוך"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        title="מחק"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">טוען...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {viewMode === 'list' && <ListView />}
      {viewMode === 'edit' && currentPopup && (
        <EditForm
          currentPopup={currentPopup}
          setCurrentPopup={setCurrentPopup}
          editingIndex={editingIndex}
          saving={saving}
          uploading={uploading}
          message={message}
          handleCancel={handleCancel}
          handleSave={handleSave}
          handleFileSelect={handleFileSelect}
          generateNewId={generateNewId}
          fileInputRef={fileInputRef}
          setShowPreview={setShowPreview}
        />
      )}
    </>
  )
}

export default AdminPopup
