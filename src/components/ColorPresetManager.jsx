import { useState, useEffect } from 'react'
import { Palette, Save, Trash2, Download, Upload, Check } from 'lucide-react'
import { colorPresets } from '../utils/colorUtils'

const ColorPresetManager = ({ currentColors, onApplyPreset }) => {
  const [customPresets, setCustomPresets] = useState([])
  const [presetName, setPresetName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('customColorPresets')
    if (saved) {
      setCustomPresets(JSON.parse(saved))
    }
  }, [])

  const saveCustomPreset = () => {
    if (!presetName.trim()) return

    const newPreset = {
      id: Date.now(),
      name: presetName,
      colors: { ...currentColors }
    }

    const updated = [...customPresets, newPreset]
    setCustomPresets(updated)
    localStorage.setItem('customColorPresets', JSON.stringify(updated))
    
    setPresetName('')
    setShowSaveDialog(false)
  }

  const deleteCustomPreset = (id) => {
    if (!confirm('האם למחוק ערכה זו?')) return
    
    const updated = customPresets.filter(p => p.id !== id)
    setCustomPresets(updated)
    localStorage.setItem('customColorPresets', JSON.stringify(updated))
  }

  const exportPresets = () => {
    const data = JSON.stringify(customPresets, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'color-presets.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importPresets = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        const updated = [...customPresets, ...imported]
        setCustomPresets(updated)
        localStorage.setItem('customColorPresets', JSON.stringify(updated))
        alert('הערכות יובאו בהצלחה!')
      } catch (error) {
        alert('שגיאה בייבוא הקובץ')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {/* Built-in Presets */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Palette className="text-primary-600" size={24} />
          ערכות צבעים מוכנות
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(colorPresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onApplyPreset(preset)}
              className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-400 hover:shadow-lg transition-all text-right group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800 group-hover:text-primary-600">
                  {preset.name}
                </span>
                <Check className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </div>
              <div className="flex gap-2">
                <div
                  className="flex-1 h-12 rounded-lg shadow-sm"
                  style={{ backgroundColor: preset.primary }}
                  title="Primary"
                />
                <div
                  className="flex-1 h-12 rounded-lg shadow-sm"
                  style={{ backgroundColor: preset.secondary }}
                  title="Secondary"
                />
                <div
                  className="flex-1 h-12 rounded-lg shadow-sm"
                  style={{ backgroundColor: preset.accent }}
                  title="Accent"
                />
              </div>
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>ראשי</span>
                <span>משני</span>
                <span>הדגשה</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Presets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Save className="text-secondary-600" size={24} />
            הערכות שלי
          </h3>
          <div className="flex gap-2">
            {customPresets.length > 0 && (
              <button
                onClick={exportPresets}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <Download size={16} />
                ייצוא
              </button>
            )}
            <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 text-sm cursor-pointer">
              <Upload size={16} />
              ייבוא
              <input
                type="file"
                accept=".json"
                onChange={importPresets}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Save size={16} />
              שמור ערכה נוכחית
            </button>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="mb-4 p-4 border-2 border-primary-200 bg-primary-50 rounded-lg animate-fade-in">
            <label className="block text-slate-700 font-medium mb-2">שם הערכה</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="לדוגמה: ערכת הצבעים שלי"
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && saveCustomPreset()}
                autoFocus
              />
              <button
                onClick={saveCustomPreset}
                disabled={!presetName.trim()}
                className="btn-primary disabled:opacity-50"
              >
                שמור
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false)
                  setPresetName('')
                }}
                className="px-4 py-2 bg-slate-300 hover:bg-slate-400 rounded-lg transition-colors"
              >
                בטל
              </button>
            </div>
          </div>
        )}

        {/* Custom Presets Grid */}
        {customPresets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-4 border-2 border-slate-200 rounded-lg hover:border-secondary-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 group-hover:text-secondary-600">
                    {preset.name}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onApplyPreset(preset.colors)}
                      className="p-1 hover:bg-green-100 rounded transition-colors"
                      title="החל ערכה"
                    >
                      <Check className="text-green-600" size={18} />
                    </button>
                    <button
                      onClick={() => deleteCustomPreset(preset.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="מחק ערכה"
                    >
                      <Trash2 className="text-red-600" size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex-1 h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="flex-1 h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div
                    className="flex-1 h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Palette size={48} className="mx-auto mb-3 opacity-30" />
            <p>עדיין לא שמרת ערכות צבעים מותאמות אישית</p>
            <p className="text-sm mt-1">לחץ על "שמור ערכה נוכחית" כדי להתחיל</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ColorPresetManager
