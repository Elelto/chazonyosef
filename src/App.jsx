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
import { ColorProvider, useColors } from './contexts/ColorContext'
import { FontProvider, useFonts } from './contexts/FontContext'
import HolidayElementManager from './components/HolidayElementManager'

function AppContent() {
  const { colorsLoaded } = useColors()
  const { fontsLoaded } = useFonts()

  useEffect(() => {
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init()
    }
  }, [])

  // Show loading spinner until colors and fonts are loaded
  if (!colorsLoaded || !fontsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <HolidayElementManager />
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

function App() {
  return (
    <ColorProvider>
      <FontProvider>
        <AppContent />
      </FontProvider>
    </ColorProvider>
  )
}

export default App
