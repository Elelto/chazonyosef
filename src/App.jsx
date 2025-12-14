import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import PrayerTimes from './pages/PrayerTimes'
import Gallery from './pages/Gallery'
import Newsletter from './pages/Newsletter'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import { fetchFromFirebase } from './utils/api'
import { applyColorsToCSS } from './utils/colorUtils'

function App() {
  const [colorsLoaded, setColorsLoaded] = useState(false)

  useEffect(() => {
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init()
    }

    // Load and apply color settings
    loadColorSettings()
  }, [])

  const loadColorSettings = async () => {
    // First, apply colors from localStorage synchronously (if available)
    // This prevents the flash since it happens before render
    const saved = localStorage.getItem('siteSettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (settings.colors) {
          console.log('🎨 Applying colors from localStorage (sync)')
          applyColorsToCSS(settings.colors)
        }
      } catch (error) {
        console.error('Error parsing localStorage settings:', error)
      }
    }
    
    // Mark colors as loaded so UI can render
    setColorsLoaded(true)

    // Then, fetch from Firebase in the background to get latest colors
    try {
      const data = await fetchFromFirebase('firebase-settings')
      if (data.settings?.colors) {
        console.log('🎨 Updating colors from Firebase:', data.settings.colors)
        applyColorsToCSS(data.settings.colors)
        localStorage.setItem('siteSettings', JSON.stringify(data.settings))
      }
    } catch (error) {
      console.log('📦 Using localStorage colors (Firebase unavailable)')
    }
  }

  // Show loading spinner until colors are loaded
  if (!colorsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
