import { useState, useEffect } from 'react'
import { X, AlertTriangle, Info, Bell } from 'lucide-react'
import { fetchFromFirebase } from '../utils/api'

const UrgentPopup = () => {
  const [popup, setPopup] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPopup()
  }, [])

  const loadPopup = async () => {
    try {
      console.log('🎯 UrgentPopup: Loading popup...')
      const sessionHidden = sessionStorage.getItem('popupHidden')
      console.log('📦 Session hidden status:', sessionHidden)
      
      const data = await fetchFromFirebase('firebase-popup')
      console.log('📥 Received popup data:', data)
      
      // Handle both old format (single popup) and new format (array of popups)
      let popups = []
      if (data && data.popups) {
        popups = data.popups
        console.log('✅ Found popups array:', popups.length, 'items')
      } else if (data && data.popup) {
        popups = [data.popup]
        console.log('✅ Found single popup, converted to array')
      } else {
        console.log('⚠️ No popup data found')
      }
      
      // Filter active popups that are within date range
      const now = new Date()
      console.log('🕐 Current time:', now.toISOString())
      
      const activePopups = popups.filter(p => {
        console.log('🔍 Checking popup:', p.id, {
          isActive: p.isActive,
          startDate: p.startDate,
          endDate: p.endDate
        })
        
        if (!p.isActive) {
          console.log('❌ Popup not active:', p.id)
          return false
        }
        
        const startDate = p.startDate ? new Date(p.startDate) : null
        const endDate = p.endDate ? new Date(p.endDate) : null
        
        const isWithinDateRange = 
          (!startDate || now >= startDate) && 
          (!endDate || now <= endDate)
        
        console.log('📅 Date range check for', p.id, ':', isWithinDateRange)
        
        return isWithinDateRange
      })
      
      console.log('✅ Active popups after filtering:', activePopups.length)
      
      if (activePopups.length === 0) {
        console.log('⚠️ No active popups to display')
        return
      }
      
      // Get the most recent active popup (by createdAt or updatedAt)
      const currentPopup = activePopups.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0)
        const dateB = new Date(b.updatedAt || b.createdAt || 0)
        return dateB - dateA
      })[0]
      
      console.log('🎯 Selected popup to show:', currentPopup.id, currentPopup.title)
      
      // Check if we should show it based on ID and session
      const lastSeenId = localStorage.getItem('lastSeenPopupId')
      const isNewPopup = currentPopup.id !== lastSeenId
      
      console.log('🔍 Last seen popup ID:', lastSeenId)
      console.log('🆕 Is new popup:', isNewPopup)
      
      if (isNewPopup) {
        sessionStorage.removeItem('popupHidden')
        console.log('🔄 Cleared session hidden status for new popup')
      }
      
      const shouldShow = isNewPopup || !sessionHidden
      console.log('👁️ Should show popup:', shouldShow)
      
      if (shouldShow) {
        setPopup(currentPopup)
        console.log('✅ Popup set, will show in 1 second')
        setTimeout(() => setIsVisible(true), 1000)
      } else {
        console.log('❌ Popup not shown - already seen in this session')
      }
    } catch (error) {
      console.error('❌ Error loading popup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    if (popup) {
      // Save to session storage to not show again this session
      sessionStorage.setItem('popupHidden', 'true')
      // Save ID to local storage to track which specific popup was seen
      localStorage.setItem('lastSeenPopupId', popup.id)
    }
  }

  const handleAction = () => {
    if (popup.actionUrl) {
      window.open(popup.actionUrl, '_blank')
    }
    handleClose()
  }

  if (loading || !popup || !isVisible) return null

  // Icon selection
  const getIcon = () => {
    switch (popup.type) {
      case 'warning': return <AlertTriangle size={32} className="text-red-500" />
      case 'info': return <Info size={32} className="text-blue-500" />
      default: return <Bell size={32} className="text-gold-500" />
    }
  }

  // Color theme selection
  const getThemeClasses = () => {
    switch (popup.type) {
      case 'warning': return 'border-red-500 bg-red-50'
      case 'info': return 'border-blue-500 bg-blue-50'
      default: return 'border-gold-500 bg-gold-50'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full max-w-lg p-4 sm:p-6 bg-white rounded-xl shadow-2xl border-t-4 transform transition-all duration-300 scale-100 max-h-[95vh] overflow-y-auto ${getThemeClasses()}`}
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={handleClose}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-full bg-white hover:bg-slate-100 transition-colors text-slate-700 shadow-md z-10 border border-slate-200"
          aria-label="סגור"
        >
          <X size={24} className="sm:w-5 sm:h-5" />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white rounded-full shadow-sm">
            {getIcon()}
          </div>
          
          {popup.title && (
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 px-2">
              {popup.title}
            </h3>
          )}
          
          {popup.message && (
            <div className="text-sm sm:text-base text-slate-600 mb-4 whitespace-pre-wrap px-2">
              {popup.message}
            </div>
          )}

          {popup.actionUrl && popup.actionUrl.startsWith('http') && (
            <div className="mb-4 sm:mb-6 w-full px-2">
              <img 
                src={popup.actionUrl} 
                alt={popup.title || 'תמונה'} 
                className="w-full max-h-60 sm:max-h-80 object-contain rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}

          <button
            onClick={handleAction}
            className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-medium transition-transform active:scale-95 text-sm sm:text-base min-w-[120px] ${
              popup.type === 'warning' ? 'bg-red-500 hover:bg-red-600' :
              popup.type === 'info' ? 'bg-blue-500 hover:bg-blue-600' :
              'bg-gold-500 hover:bg-gold-600'
            }`}
          >
            {popup.buttonText || 'סגור'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UrgentPopup
