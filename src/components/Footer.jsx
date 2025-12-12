import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchFromFirebase } from '../utils/api'

// Default content for development mode
const defaultContent = {
  about: {
    title: 'בית המדרש "חזון יוסף"',
    description: 'בית מדרש לתורה ותפילה המשרת את קהילת שיכון ג\' והסביבה בבני ברק. מזמינים אתכם להצטרף לשיעורים ולתפילות.'
  },
  contact: {
    address: 'בעל התניא 26',
    city: 'בני ברק',
    phone: '***-***-****',
    email: '***@***.com'
  },
  prayerTimes: {
    title: 'זמני תפילה',
    shacharit: '6:30, 7:30',
    mincha: '13:30',
    arvit: '20:00',
    linkText: 'לזמנים מלאים →'
  },
  copyright: {
    text: 'בית המדרש "חזון יוסף". כל הזכויות שמורות.',
    subtext: 'פותח באהבה עבור קהילת שיכון ג\' והסביבה'
  }
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [content, setContent] = useState(null)
  const isDev = import.meta.env.DEV

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    // In development mode, use default content without API call
    if (isDev) {
      console.log('🔧 Dev mode: Using default footer content')
      setContent(defaultContent)
      return
    }

    // In production, fetch from Firebase
    try {
      const data = await fetchFromFirebase('firebase-footer')
      if (data.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error loading footer content:', error)
    }
  }

  if (!content) return null

  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gold-400">
              {content.about.title}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {content.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gold-400">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  דף הבית
                </Link>
              </li>
              <li>
                <Link
                  to="/prayer-times"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  זמני תפילות
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  גלריה
                </Link>
              </li>
              <li>
                <Link
                  to="/newsletter"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  רשימת תפוצה
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gold-400">פרטי התקשרות</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">
                  {content.contact.address}<br />{content.contact.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gold-400 flex-shrink-0" />
                <span className="text-slate-300">{content.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-gold-400 flex-shrink-0" />
                <span className="text-slate-300">{content.contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Prayer Times */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gold-400">{content.prayerTimes.title}</h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                <span>שחרית: {content.prayerTimes.shacharit}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                <span>מנחה: {content.prayerTimes.mincha}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                <span>ערבית: {content.prayerTimes.arvit}</span>
              </div>
              <Link
                to="/prayer-times"
                className="inline-block mt-3 text-gold-400 hover:text-gold-300 transition-colors underline"
              >
                {content.prayerTimes.linkText}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} {content.copyright.text}
          </p>
          <p className="text-slate-500 text-sm mt-2">
            {content.copyright.subtext}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
