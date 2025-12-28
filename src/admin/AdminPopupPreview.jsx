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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6">
        <button 
          onClick={onClose}
          className="absolute top-3 left-3 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
        >
          <X size={24} />
        </button>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">תצוגה מקדימה</h3>
        
        <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg">
          <div 
            className={`relative w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border-t-4 ${getThemeClasses()}`}
          >
            <button 
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

              {popup.actionUrl && popup.actionUrl.startsWith('http') && (
                <div className="mb-6 w-full">
                  <img 
                    src={popup.actionUrl} 
                    alt={popup.title || 'תמונה'} 
                    className="w-full max-h-96 object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}

              <button
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
