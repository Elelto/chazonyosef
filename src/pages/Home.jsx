import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Image, Mail, Phone, BookOpen, Users, Heart } from 'lucide-react'
import { fetchFromFirebase } from '../utils/api'

// Default content for development mode
const defaultContent = {
  hero: {
    title: 'בית המדרש "חזון יוסף"',
    subtitle: 'שיכון ג\' והסביבה',
    address: 'בעל התניא 26, בני ברק'
  },
  about: {
    title: 'אודות בית המדרש',
    paragraph1: 'בית המדרש "חזון יוסף" משמש כמרכז רוחני לקהילת שיכון ג\' והסביבה בבני ברק. אנו מציעים תפילות במניינים קבועים, שיעורי תורה מגוונים, ואווירה חמה ומזמינה לכל המבקשים להתקרב לתורה ולעבודת ה\'.',
    paragraph2: 'בית המדרש נקרא על שם הרב יוסף זצ"ל, ומשמש כמקום מפגש לתלמידי חכמים, אברכים ובעלי בתים המבקשים לעסוק בתורה ובתפילה באווירה של קדושה ויראת שמים.'
  },
  features: {
    title: 'מה אנו מציעים',
    items: [
      {
        id: 1,
        title: 'תפילות במניין',
        description: 'מניינים קבועים לשחרית, מנחה וערבית בזמנים נוחים לכל הציבור',
        icon: 'clock'
      },
      {
        id: 2,
        title: 'שיעורי תורה',
        description: 'שיעורים מגוונים בגמרא, הלכה, מוסר ומחשבה על ידי מגידי שיעורים מובילים',
        icon: 'book'
      },
      {
        id: 3,
        title: 'קהילה חמה',
        description: 'אווירה משפחתית ומזמינה, קהילה תומכת ומגובשת של אנשים יראי שמים',
        icon: 'users'
      },
      {
        id: 4,
        title: 'אירועים מיוחדים',
        description: 'סיומי מסכת, מסיבות מצווה, וערבי עיון מיוחדים לחגים ומועדים',
        icon: 'heart'
      },
      {
        id: 5,
        title: 'מתקנים מודרניים',
        description: 'בית מדרש מרווח ומאובזר, ספריית קודש עשירה, ומערכת הגברה איכותית',
        icon: 'image'
      },
      {
        id: 6,
        title: 'עדכונים שוטפים',
        description: 'הצטרפו לרשימת התפוצה שלנו לקבלת עדכונים על שיעורים, אירועים וזמני תפילה',
        icon: 'mail'
      }
    ]
  },
  cta: {
    title: 'הצטרפו אלינו',
    description: 'אנו מזמינים אתכם להצטרף לקהילה שלנו, להשתתף בתפילות ובשיעורים, ולהיות חלק ממשפחת "חזון יוסף"'
  },
  quickLinks: {
    title: 'גישה מהירה'
  }
}

const Home = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const isDev = import.meta.env.DEV

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    // In development mode, use default content without API call
    if (isDev) {
      console.log('🔧 Dev mode: Using default site content')
      setContent(defaultContent)
      setLoading(false)
      return
    }

    // In production, fetch from Firebase
    try {
      const data = await fetchFromFirebase('firebase-site-content')
      if (data.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error loading site content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      clock: Clock,
      book: BookOpen,
      users: Users,
      heart: Heart,
      image: Image,
      mail: Mail
    }
    return icons[iconName] || Clock
  }

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50/30 to-slate-50 border-b border-slate-200 py-20 overflow-hidden">
        {/* Background Image with Black & White Filter */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/hero-bg.jpeg)',
            filter: 'grayscale(100%)',
            opacity: '0.3'
          }}
        />
        
        {/* Content Overlay */}
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="חזון יוסף"
                className="h-32 w-auto mx-auto loaded"
                onLoad={(e) => e.target.classList.add('loaded')}
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-slate-700">
              {content.hero.subtitle}
            </p>
            <p className="text-base md:text-lg text-slate-600 mb-12">
              {content.hero.address}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/prayer-times" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2">
                <Clock size={20} />
                זמני תפילות
              </Link>
              <Link to="/contact" className="border-2 border-primary-600 hover:bg-primary-600 text-primary-600 hover:text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2">
                <Phone size={20} />
                צור קשר
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-8 text-center">{content.about.title}</h2>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              {content.about.paragraph1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              {content.about.paragraph2}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-primary-50/20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-8 text-center">{content.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.items.map((item, index) => {
              const Icon = getIcon(item.icon)
              const isPrimary = index % 2 === 0
              return (
                <div key={item.id} className={isPrimary 
                  ? 'card text-center border-r-4 border-primary-600 hover:shadow-lg hover:shadow-primary-100 transition-all'
                  : 'card text-center border-r-4 border-secondary-600 hover:shadow-lg hover:shadow-secondary-100 transition-all'
                }>
                  <div className="mb-6">
                    <div className={isPrimary 
                      ? 'w-16 h-16 bg-primary-100 flex items-center justify-center mx-auto rounded-lg'
                      : 'w-16 h-16 bg-secondary-100 flex items-center justify-center mx-auto rounded-lg'
                    }>
                      <Icon className={isPrimary ? 'text-primary-700' : 'text-secondary-700'} size={32} />
                    </div>
                  </div>
                  <h3 className={isPrimary ? 'text-xl font-bold mb-3 text-primary-900' : 'text-xl font-bold mb-3 text-secondary-900'}>
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-50 border-b border-slate-200">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-900">
            {content.cta.title}
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto text-slate-600">
            {content.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/newsletter" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2">
              <Mail size={20} />
              הרשמה לרשימת תפוצה
            </Link>
            <Link
              to="/contact"
              className="border-2 border-primary-600 hover:bg-primary-600 text-primary-600 hover:text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2"
            >
              <Phone size={20} />
              צור קשר
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gradient-to-b from-primary-50/20 to-slate-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-8 text-center">{content.quickLinks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/prayer-times"
              className="card text-center hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100 transition-all border-t-4 border-t-primary-600"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-primary-900">זמני תפילות</h3>
            </Link>
            <Link
              to="/gallery"
              className="card text-center hover:border-secondary-300 hover:shadow-lg hover:shadow-secondary-100 transition-all border-t-4 border-t-secondary-600"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Image className="text-secondary-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-secondary-900">גלריה</h3>
            </Link>
            <Link
              to="/newsletter"
              className="card text-center hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100 transition-all border-t-4 border-t-primary-600"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="text-primary-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-primary-900">רשימת תפוצה</h3>
            </Link>
            <Link
              to="/contact"
              className="card text-center hover:border-secondary-300 hover:shadow-lg hover:shadow-secondary-100 transition-all border-t-4 border-t-secondary-600"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="text-secondary-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-secondary-900">צור קשר</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
