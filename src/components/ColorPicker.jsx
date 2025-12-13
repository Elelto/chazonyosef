import { useState, useEffect } from 'react'
import { Palette, Check, Star, AlertCircle } from 'lucide-react'
import { 
  generateShades, 
  commonColors, 
  colorPresets, 
  checkAccessibility 
} from '../utils/colorUtils'

const ColorPicker = ({ 
  label, 
  value, 
  onChange, 
  showShades = true,
  showPreview = true,
  showAccessibility = true 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [shades, setShades] = useState({})
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('picker')

  useEffect(() => {
    if (value) {
      setShades(generateShades(value))
    }
    
    const savedFavorites = localStorage.getItem('favoriteColors')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [value])

  const handleColorChange = (newColor) => {
    onChange(newColor)
    setShades(generateShades(newColor))
  }

  const toggleFavorite = (color) => {
    let newFavorites
    if (favorites.includes(color)) {
      newFavorites = favorites.filter(c => c !== color)
    } else {
      newFavorites = [...favorites, color]
    }
    setFavorites(newFavorites)
    localStorage.setItem('favoriteColors', JSON.stringify(newFavorites))
  }

  const accessibility = showAccessibility ? checkAccessibility(value, '#ffffff') : null

  return (
    <div className="space-y-3">
      <label className="block text-slate-700 font-medium">{label}</label>
      
      <div className="flex gap-3">
        {/* Color Display Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-20 h-12 rounded-lg border-2 border-slate-300 hover:border-slate-400 transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: value }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Palette className="text-white drop-shadow-lg" size={20} />
          </div>
        </button>

        {/* Color Input */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-16 h-12 rounded-lg cursor-pointer border-2 border-slate-300"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleColorChange(e.target.value)}
              className="input-field flex-1"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
            <button
              type="button"
              onClick={() => toggleFavorite(value)}
              className={`px-3 rounded-lg transition-colors ${
                favorites.includes(value)
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Star size={20} fill={favorites.includes(value) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Accessibility Info */}
          {showAccessibility && accessibility && (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle size={16} className={
                accessibility.AA ? 'text-green-600' : 'text-orange-600'
              } />
              <span className={
                accessibility.AA ? 'text-green-700' : 'text-orange-700'
              }>
                ניגודיות: {accessibility.ratio}:1
                {accessibility.AA ? ' ✓ WCAG AA' : ' ⚠️ נמוכה'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Color Picker */}
      {isOpen && (
        <div className="border-2 border-slate-200 rounded-lg p-4 bg-white shadow-lg animate-fade-in">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('picker')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'picker'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              בחירה חופשית
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'presets'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              ערכות מוכנות
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('common')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'common'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              צבעים נפוצים
            </button>
            {favorites.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'favorites'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                מועדפים ⭐
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'picker' && showShades && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">גווני צבע</h4>
                <div className="grid grid-cols-9 gap-2">
                  {Object.entries(shades).map(([shade, color]) => (
                    <button
                      key={shade}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className="relative group"
                      title={`${shade} - ${color}`}
                    >
                      <div
                        className="w-full h-12 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-lg"
                        style={{ 
                          backgroundColor: color,
                          borderColor: value === color ? '#1e293b' : 'transparent'
                        }}
                      >
                        {value === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="text-white drop-shadow-lg" size={16} />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-slate-600 mt-1 block group-hover:font-bold">
                        {shade}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'presets' && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">ערכות צבעים מוכנות</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(colorPresets).map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleColorChange(preset.primary)}
                      className="p-3 border-2 border-slate-200 rounded-lg hover:border-slate-400 transition-all text-right"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-slate-700">{preset.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'common' && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">צבעים נפוצים</h4>
                <div className="grid grid-cols-10 gap-2">
                  {commonColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className="relative group"
                      title={color}
                    >
                      <div
                        className="w-full h-10 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-lg"
                        style={{ 
                          backgroundColor: color,
                          borderColor: value === color ? '#1e293b' : 'transparent'
                        }}
                      >
                        {value === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="text-white drop-shadow-lg" size={16} />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && favorites.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">צבעים מועדפים</h4>
                <div className="grid grid-cols-10 gap-2">
                  {favorites.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className="relative group"
                      title={color}
                    >
                      <div
                        className="w-full h-10 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-lg"
                        style={{ 
                          backgroundColor: color,
                          borderColor: value === color ? '#1e293b' : 'transparent'
                        }}
                      >
                        {value === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="text-white drop-shadow-lg" size={16} />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Preview */}
      {showPreview && (
        <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50">
          <h4 className="text-sm font-medium text-slate-700 mb-3">תצוגה מקדימה</h4>
          <div className="space-y-3">
            <button
              type="button"
              className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: value }}
            >
              כפתור לדוגמה
            </button>
            <div className="flex gap-2">
              <div
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: value + '20', color: value }}
              >
                תג צבעוני
              </div>
              <div
                className="px-4 py-2 rounded-lg border-2 text-sm font-medium"
                style={{ borderColor: value, color: value }}
              >
                מסגרת צבעונית
              </div>
            </div>
            <p className="text-slate-600">
              זהו <span style={{ color: value }} className="font-bold">טקסט צבעוני</span> בתוך פסקה רגילה
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
