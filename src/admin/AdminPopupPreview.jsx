import { X, AlertTriangle, Info, Bell } from 'lucide-react'

const AdminPopupPreview = ({ popup, onClose }) => {
  if (!popup) return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-full bg-white hover:bg-slate-100 transition-colors text-slate-700 shadow-md z-10 border border-slate-200"
        >
          <X size={24} className="sm:w-6 sm:h-6" />
        </button>
        
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 text-center pt-2">תצוגה מקדימה</h3>
        
        <div className="flex items-center justify-center p-4 sm:p-8 bg-slate-50 rounded-lg">
          <div 
            className={`relative w-full max-w-lg p-4 sm:p-6 bg-white rounded-xl shadow-2xl border-t-4 ${getThemeClasses()}`}
          >
            <button 
              className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-full bg-white hover:bg-slate-100 transition-colors text-slate-700 shadow-md border border-slate-200"
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
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-medium text-sm sm:text-base min-w-[120px] ${
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
        
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-medium"
          >
            סגור תצוגה
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPopupPreview
