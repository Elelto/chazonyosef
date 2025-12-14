import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, Clock, Image, Mail, Phone, LogIn } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'דף הבית', icon: Home },
    { path: '/prayer-times', label: 'זמני תפילות', icon: Clock },
    { path: '/gallery', label: 'גלריה', icon: Image },
    { path: '/newsletter', label: 'רשימת תפוצה', icon: Mail },
    { path: '/contact', label: 'צור קשר', icon: Phone },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="חזון יוסף"
              className="h-12 w-auto logo-image"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-primary-900">
                בית המדרש "חזון יוסף"
              </h1>
              <p className="text-sm text-slate-600">שיכון ג' והסביבה</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-700 hover:bg-primary-50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              )
            })}
            <Link
              to="/admin"
              className="mr-2 flex items-center gap-2 px-4 py-2 rounded border border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors"
            >
              <LogIn size={16} />
              <span className="font-medium text-sm">כניסת אדמין</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded transition-colors"
            aria-label="תפריט"
          >
            {isOpen ? <X size={24} className="text-slate-700" /> : <Menu size={24} className="text-slate-700" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-700 hover:bg-primary-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )
              })}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded border border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors"
              >
                <LogIn size={18} />
                <span className="font-medium">כניסת אדמין</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
