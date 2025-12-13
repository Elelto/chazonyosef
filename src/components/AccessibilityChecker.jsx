import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { checkAccessibility } from '../utils/colorUtils'

const AccessibilityChecker = ({ foreground, background = '#ffffff' }) => {
  const result = checkAccessibility(foreground, background)
  
  const getStatusIcon = (passed) => {
    return passed ? (
      <CheckCircle className="text-green-600" size={20} />
    ) : (
      <AlertCircle className="text-orange-600" size={20} />
    )
  }

  const getStatusColor = (passed) => {
    return passed ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'
  }

  return (
    <div className="border-2 border-slate-200 rounded-lg p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Info className="text-primary-600" size={20} />
        <h4 className="font-bold text-slate-800">בדיקת נגישות (WCAG)</h4>
      </div>

      <div className="space-y-3">
        {/* Contrast Ratio */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="font-medium text-slate-700">יחס ניגודיות</span>
          <span className="text-2xl font-bold text-primary-600">{result.ratio}:1</span>
        </div>

        {/* Color Preview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div 
              className="h-20 rounded-lg border-2 border-slate-300 flex items-center justify-center mb-2"
              style={{ backgroundColor: background }}
            >
              <span style={{ color: foreground }} className="font-bold text-lg">
                טקסט לדוגמה
              </span>
            </div>
            <span className="text-xs text-slate-600">רקע בהיר</span>
          </div>
          <div className="text-center">
            <div 
              className="h-20 rounded-lg border-2 border-slate-300 flex items-center justify-center mb-2"
              style={{ backgroundColor: '#1e293b' }}
            >
              <span style={{ color: foreground }} className="font-bold text-lg">
                טקסט לדוגמה
              </span>
            </div>
            <span className="text-xs text-slate-600">רקע כהה</span>
          </div>
        </div>

        {/* WCAG Standards */}
        <div className="space-y-2">
          <h5 className="text-sm font-bold text-slate-700 mb-2">תקני WCAG 2.1:</h5>
          
          {/* Normal Text AA */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(result.AA)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(result.AA)}
              <span className="font-medium">טקסט רגיל - AA</span>
            </div>
            <span className="text-sm">דרוש 4.5:1</span>
          </div>

          {/* Normal Text AAA */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(result.AAA)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(result.AAA)}
              <span className="font-medium">טקסט רגיל - AAA</span>
            </div>
            <span className="text-sm">דרוש 7:1</span>
          </div>

          {/* Large Text AA */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(result.AALarge)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(result.AALarge)}
              <span className="font-medium">טקסט גדול - AA</span>
            </div>
            <span className="text-sm">דרוש 3:1</span>
          </div>

          {/* Large Text AAA */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(result.AAALarge)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(result.AAALarge)}
              <span className="font-medium">טקסט גדול - AAA</span>
            </div>
            <span className="text-sm">דרוש 4.5:1</span>
          </div>
        </div>

        {/* Recommendations */}
        {!result.AA && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>💡 המלצה:</strong> הצבע הנוכחי לא עומד בתקני נגישות בסיסיים. 
              מומלץ לבחור צבע כהה יותר או בהיר יותר כדי לשפר את הניגודיות.
            </p>
          </div>
        )}

        {result.AA && !result.AAA && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>✓ טוב:</strong> הצבע עומד בתקן AA. 
              לנגישות מקסימלית, שקול לשפר את הניגודיות לתקן AAA.
            </p>
          </div>
        )}

        {result.AAA && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✓ מעולה!</strong> הצבע עומד בתקן AAA - רמת הנגישות הגבוהה ביותר.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccessibilityChecker
