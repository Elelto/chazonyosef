import { createContext, useContext, useState, useEffect } from 'react'
import { fetchFromFirebase } from '../utils/api'
import { applyFont } from '../utils/fontUtils'

const FontContext = createContext()

export const useFonts = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFonts must be used within FontProvider')
  }
  return context
}

export const FontProvider = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    loadFontSettings()
  }, [])

  const loadFontSettings = async () => {
    const saved = localStorage.getItem('siteSettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (settings.font) {
          console.log('🔤 Applying font from localStorage (sync):', settings.font)
          applyFont(settings.font)
        }
      } catch (error) {
        console.error('Error parsing localStorage settings:', error)
      }
    }
    
    setFontsLoaded(true)

    try {
      const data = await fetchFromFirebase('firebase-settings')
      if (data.settings?.font) {
        console.log('🔤 Updating font from Firebase:', data.settings.font)
        applyFont(data.settings.font)
        const currentSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}')
        localStorage.setItem('siteSettings', JSON.stringify({
          ...currentSettings,
          font: data.settings.font
        }))
      }
    } catch (error) {
      console.log('📦 Using localStorage font (Firebase unavailable)')
    }
  }

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  )
}
