import { createContext, useContext, useState, useEffect } from 'react'
import { fetchFromFirebase } from '../utils/api'
import { applyColorsToCSS } from '../utils/colorUtils'
import { applyFont } from '../utils/fontUtils'

const ColorContext = createContext()

export const useColors = () => {
  const context = useContext(ColorContext)
  if (!context) {
    throw new Error('useColors must be used within ColorProvider')
  }
  return context
}

export const ColorProvider = ({ children }) => {
  const [colorsLoaded, setColorsLoaded] = useState(false)

  useEffect(() => {
    loadColorSettings()
  }, [])

  const loadColorSettings = async () => {
    // First, apply colors and fonts from localStorage synchronously (if available)
    const saved = localStorage.getItem('siteSettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (settings.colors) {
          console.log('🎨 Applying colors from localStorage (sync)')
          applyColorsToCSS(settings.colors)
        }
        if (settings.font) {
          console.log('🔤 Applying font from localStorage (sync):', settings.font)
          applyFont(settings.font)
        }
      } catch (error) {
        console.error('Error parsing localStorage settings:', error)
      }
    }
    
    // Mark colors as loaded so UI can render
    setColorsLoaded(true)

    // Then, fetch from Firebase in the background to get latest colors and fonts
    try {
      const data = await fetchFromFirebase('firebase-settings')
      if (data.settings) {
        if (data.settings.colors) {
          console.log('🎨 Updating colors from Firebase:', data.settings.colors)
          applyColorsToCSS(data.settings.colors)
        }
        if (data.settings.font) {
          console.log('🔤 Updating font from Firebase:', data.settings.font)
          applyFont(data.settings.font)
        }
        localStorage.setItem('siteSettings', JSON.stringify(data.settings))
      }
    } catch (error) {
      console.log('📦 Using localStorage settings (Firebase unavailable)')
    }
  }

  return (
    <ColorContext.Provider value={{ colorsLoaded }}>
      {children}
    </ColorContext.Provider>
  )
}
