import { Link } from 'react-router-dom'
import { Clock, Image, Mail, Phone, BookOpen, Users, Heart } from 'lucide-react'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/30 to-slate-50 border-b border-slate-200 py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="חזון יוסף"
                className="h-32 w-auto mx-auto"
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              בית המדרש "חזון יוסף"
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-slate-700">
              שיכון ג' והסביבה
            </p>
            <p className="text-base md:text-lg text-slate-600 mb-12">
              בעל התניא 26, בני ברק
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/prayer-times" className="bg-indigo-900 hover:bg-indigo-950 text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2">
                <Clock size={20} />
                זמני תפילות
              </Link>
              <Link to="/contact" className="border-2 border-indigo-900 hover:bg-indigo-900 text-indigo-900 hover:text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2">
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
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-8 text-center">אודות בית המדרש</h2>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              בית המדרש "חזון יוסף" משמש כמרכז רוחני לקהילת שיכון ג' והסביבה בבני ברק.
              אנו מציעים תפילות במניינים קבועים, שיעורי תורה מגוונים, ואווירה חמה ומזמינה
              לכל המבקשים להתקרב לתורה ולעבודת ה'.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              בית המדרש נקרא על שם הרב יוסף זצ"ל, ומשמש כמקום מפגש לתלמידי חכמים,
              אברכים ובעלי בתים המבקשים לעסוק בתורה ובתפילה באווירה של קדושה ויראת שמים.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-indigo-50/20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-8 text-center">מה אנו מציעים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center border-r-4 border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all">
              <div className="mb-6">
                <div className="w-16 h-16 bg-indigo-100 flex items-center justify-center mx-auto rounded-lg">
                  <Clock className="text-indigo-700" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-900">
                תפילות במניין
              </h3>
              <p className="text-slate-600 leading-relaxed">
                מניינים קבועים לשחרית, מנחה וערבית בזמנים נוחים לכל הציבור
              </p>
            </div>

            <div className="card text-center border-r-4 border-teal-600 hover:shadow-lg hover:shadow-teal-100 transition-all">
              <div className="mb-6">
                <div className="w-16 h-16 bg-teal-100 flex items-center justify-center mx-auto rounded-lg">
                  <BookOpen className="text-teal-700" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-900">
                שיעורי תורה
              </h3>
              <p className="text-slate-600 leading-relaxed">
                שיעורים מגוונים בגמרא, הלכה, מוסר ומחשבה על ידי מגידי שיעורים מובילים
              </p>
            </div>

            <div className="card text-center border-r-4 border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all">
              <div className="mb-6">
                <div className="w-16 h-16 bg-indigo-100 flex items-center justify-center mx-auto rounded-lg">
                  <Users className="text-indigo-700" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-900">
                קהילה חמה
              </h3>
              <p className="text-slate-600 leading-relaxed">
                אווירה משפחתית ומזמינה, קהילה תומכת ומגובשת של אנשים יראי שמים
              </p>
            </div>

            <div className="card text-center border-r-4 border-teal-600 hover:shadow-lg hover:shadow-teal-100 transition-all">
              <div className="mb-6">
                <div className="w-16 h-16 bg-teal-100 flex items-center justify-center mx-auto rounded-lg">
                  <Heart className="text-teal-700" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-900">
                אירועים מיוחדים
              </h3>
              <p className="text-slate-600 leading-relaxed">
                סיומי מסכת, מסיבות מצווה, וערבי עיון מיוחדים לחגים ומועדים
              </p>
            </div>

            <div className="card text-center border-r-4 border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all">
              <div className="mb-6">
                <div className="w-16 h-16 bg-indigo-100 flex items-center justify-center mx-auto rounded-lg">
                  <Image className="text-indigo-700" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-900">
                מתקנים מודרניים
              </h3>
              <p className="text-slate-600 leading-relaxed">
                בית מדרש מרווח ומאובזר, ספריית קודש עשירה, ומערכת הגברה איכותית
              </p>
            </div>

            <div className="card text-center border-r-4 border-teal-600 hover:shadow-lg hover:shadow-teal-100 transition-all">
              <div className="mb-6">
                <div className="w-16 h-16 bg-teal-100 flex items-center justify-center mx-auto rounded-lg">
                  <Mail className="text-teal-700" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-900">
                עדכונים שוטפים
              </h3>
              <p className="text-slate-600 leading-relaxed">
                הצטרפו לרשימת התפוצה שלנו לקבלת עדכונים על שיעורים, אירועים וזמני תפילה
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-50 border-b border-slate-200">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-900">
            הצטרפו אלינו
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto text-slate-600">
            אנו מזמינים אתכם להצטרף לקהילה שלנו, להשתתף בתפילות ובשיעורים,
            ולהיות חלק ממשפחת "חזון יוסף"
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/newsletter" className="bg-indigo-900 hover:bg-indigo-950 text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2">
              <Mail size={20} />
              הרשמה לרשימת תפוצה
            </Link>
            <Link
              to="/contact"
              className="border-2 border-indigo-900 hover:bg-indigo-900 text-indigo-900 hover:text-white font-medium py-3 px-8 rounded transition-colors flex items-center gap-2"
            >
              <Phone size={20} />
              צור קשר
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gradient-to-b from-indigo-50/20 to-slate-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-8 text-center">גישה מהירה</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/prayer-times"
              className="card text-center hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 transition-all border-t-4 border-t-indigo-600"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="text-indigo-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-indigo-900">זמני תפילות</h3>
            </Link>
            <Link
              to="/gallery"
              className="card text-center hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all border-t-4 border-t-teal-600"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Image className="text-teal-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-teal-900">גלריה</h3>
            </Link>
            <Link
              to="/newsletter"
              className="card text-center hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 transition-all border-t-4 border-t-indigo-600"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="text-indigo-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-indigo-900">רשימת תפוצה</h3>
            </Link>
            <Link
              to="/contact"
              className="card text-center hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all border-t-4 border-t-teal-600"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="text-teal-700" size={28} />
              </div>
              <h3 className="text-base font-bold text-teal-900">צור קשר</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
