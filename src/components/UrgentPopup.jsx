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
      // First check session storage to avoid showing again in same session if closed
      const sessionHidden = sessionStorage.getItem('popupHidden')
      
      const data = await fetchFromFirebase('firebase-popup')
      
      if (data && data.popup && data.popup.isActive) {
        // Check if we should show it based on ID (if changed) and session
        const lastSeenId = localStorage.getItem('lastSeenPopupId')
        const isNewPopup = data.popup.id !== lastSeenId
        
        // If it's a new popup, clear the session storage
        if (isNewPopup) {
          sessionStorage.removeItem('popupHidden')
        }
        
        // Show if it's a new popup OR hasn't been hidden in this session
        const shouldShow = isNewPopup || !sessionHidden
        
        if (shouldShow) {
          setPopup(data.popup)
          // Add a small delay for animation effect
          setTimeout(() => setIsVisible(true), 1000)
        }
      }
    } catch (error) {
      console.error('Error loading popup:', error)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border-t-4 transform transition-all duration-300 scale-100 ${getThemeClasses()}`}
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 left-3 p-1 rounded-full hover:bg-black/10 transition-colors text-slate-500"
          aria-label="סגור"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {popup.title}
          </h3>
          
          <div className="text-slate-600 mb-6 whitespace-pre-wrap">
            {popup.message}
          </div>

          <button
            onClick={handleAction}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-transform active:scale-95 ${
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
