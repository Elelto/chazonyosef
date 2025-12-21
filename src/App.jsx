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
import { GradientProvider, useGradient } from './contexts/GradientContext'
import HolidayElementManager from './components/HolidayElementManager'
import UrgentPopup from './components/UrgentPopup'
import InstallPrompt from './components/InstallPrompt'
import PWAStatus from './components/PWAStatus'

function AppContent() {
  const { colorsLoaded } = useColors()
  const { fontsLoaded } = useFonts()
  const { gradientLoaded } = useGradient()

  useEffect(() => {
    // Force HTTPS redirect
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      window.location.href = window.location.href.replace('http:', 'https:')
      return
    }

    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init()
    }
  }, [])

  // Show loading spinner until colors, fonts, and gradient are loaded
  if (!colorsLoaded || !fontsLoaded || !gradientLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner"></div>
      </div>
    )
  }

  const isProduction = window.location.protocol === 'https:';

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col">
        {isProduction && <PWAStatus />}
        {isProduction && <InstallPrompt />}
        <UrgentPopup />
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
        <GradientProvider>
          <AppContent />
        </GradientProvider>
      </FontProvider>
    </ColorProvider>
  )
}

export default App
