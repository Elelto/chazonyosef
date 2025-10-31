import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { LogOut, Clock, Image, MessageSquare, Calendar, Settings } from 'lucide-react'
import AdminPrayerTimes from '../admin/AdminPrayerTimes'
import AdminGallery from '../admin/AdminGallery'
import AdminAnnouncements from '../admin/AdminAnnouncements'
import AdminEvents from '../admin/AdminEvents'

const Admin = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on('init', (user) => {
        setUser(user)
        setLoading(false)
      })

      window.netlifyIdentity.on('login', (user) => {
        setUser(user)
        window.netlifyIdentity.close()
      })

      window.netlifyIdentity.on('logout', () => {
        setUser(null)
      })
    }
  }, [])

  const handleLogin = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open()
    }
  }

  const handleLogout = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="card max-w-md w-full mx-4">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="חזון יוסף"
              className="h-24 w-auto mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              כניסת אדמין
            </h1>
            <p className="text-slate-600 mb-8">
              התחבר כדי לנהל את תוכן האתר
            </p>
            <button onClick={handleLogin} className="btn-primary w-full">
              התחבר עם Netlify Identity
            </button>
          </div>
        </div>
      </div>
    )
  }

  const navItems = [
    { path: '/admin/prayer-times', label: 'זמני תפילות', icon: Clock },
    { path: '/admin/gallery', label: 'גלריה', icon: Image },
    { path: '/admin/announcements', label: 'הודעות', icon: MessageSquare },
    { path: '/admin/events', label: 'אירועים ושיעורים', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin Header */}
      <div className="bg-white shadow-md">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="חזון יוסף" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg font-bold text-slate-800">ממשק ניהול</h1>
                <p className="text-sm text-slate-600">שלום, {user.user_metadata?.full_name || user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>התנתק</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-4">תפריט ניהול</h2>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route index element={<Navigate to="/admin/prayer-times" replace />} />
              <Route path="prayer-times" element={<AdminPrayerTimes />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="events" element={<AdminEvents />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
