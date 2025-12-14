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

function AppContent() {
  const { colorsLoaded } = useColors()

  useEffect(() => {
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init()
    }
  }, [])

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

function App() {
  return (
    <ColorProvider>
      <AppContent />
    </ColorProvider>
  )
}

export default App
