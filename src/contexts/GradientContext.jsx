import { createContext, useContext, useState, useEffect } from 'react'
import { fetchFromFirebase } from '../utils/api'
import { applyGradient, applyButtonGradient } from '../utils/gradientUtils'

const GradientContext = createContext()

export const useGradient = () => {
  const context = useContext(GradientContext)
  if (!context) {
    throw new Error('useGradient must be used within GradientProvider')
  }
  return context
}

export const GradientProvider = ({ children }) => {
  const [gradientLoaded, setGradientLoaded] = useState(false)

  useEffect(() => {
    loadGradientSettings()
  }, [])

  const loadGradientSettings = async () => {
    try {
      // First, try to load from localStorage for immediate display
      const saved = localStorage.getItem('siteSettings')
      if (saved) {
        const settings = JSON.parse(saved)
        if (settings.gradient) {
          applyGradient(settings.gradient)
        }
        if (settings.buttonGradient) {
          applyButtonGradient(settings.buttonGradient)
        }
      }

      // Then fetch from Firebase to get latest settings
      const data = await fetchFromFirebase('firebase-settings')
      if (data.settings) {
        if (data.settings.gradient) {
          applyGradient(data.settings.gradient)
        }
        if (data.settings.buttonGradient) {
          applyButtonGradient(data.settings.buttonGradient)
        }
        // Update localStorage with latest from Firebase
        localStorage.setItem('siteSettings', JSON.stringify(data.settings))
      }
    } catch (error) {
      console.error('Error loading gradient settings:', error)
    } finally {
      setGradientLoaded(true)
    }
  }

  return (
    <GradientContext.Provider value={{ gradientLoaded }}>
      {children}
    </GradientContext.Provider>
  )
}
