import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gold-400">
              בית המדרש "חזון יוסף"
            </h3>
            <p className="text-slate-300 leading-relaxed">
              בית מדרש לתורה ותפילה המשרת את קהילת שיכון ג' והסביבה בבני ברק.
              מזמינים אתכם להצטרף לשיעורים ולתפילות.
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
                  בעל התניא 26<br />בני ברק
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gold-400 flex-shrink-0" />
                <span className="text-slate-300">***-***-****</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-gold-400 flex-shrink-0" />
                <span className="text-slate-300">***@***.com</span>
              </li>
            </ul>
          </div>

          {/* Prayer Times */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gold-400">זמני תפילה</h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                <span>שחרית: 6:30, 7:30</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                <span>מנחה: 13:30</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                <span>ערבית: 20:00</span>
              </div>
              <Link
                to="/prayer-times"
                className="inline-block mt-3 text-gold-400 hover:text-gold-300 transition-colors underline"
              >
                לזמנים מלאים →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} בית המדרש "חזון יוסף". כל הזכויות שמורות.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            פותח באהבה עבור קהילת שיכון ג' והסביבה
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
