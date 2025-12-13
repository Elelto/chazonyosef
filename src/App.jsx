import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
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
  useEffect(() => {
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init()
    }

    // Load and apply color settings
    loadColorSettings()
  }, [])

  const loadColorSettings = async () => {
    try {
      // Try to load from Firebase
      const data = await fetchFromFirebase('firebase-settings')
      if (data.settings?.colors) {
        console.log('🎨 Applying colors from Firebase:', data.settings.colors)
        applyColorsToCSS(data.settings.colors)
        localStorage.setItem('siteSettings', JSON.stringify(data.settings))
      }
    } catch (error) {
      // Fallback to localStorage
      console.log('📦 Loading colors from localStorage fallback')
      const saved = localStorage.getItem('siteSettings')
      if (saved) {
        const settings = JSON.parse(saved)
        if (settings.colors) {
          applyColorsToCSS(settings.colors)
        }
      }
    }
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
