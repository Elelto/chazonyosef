import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

const Newsletter = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      // EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS לא מוגדר כראוי. אנא צור קשר עם המנהל.')
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_name: 'צוות חזון יוסף',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: `הרשמה חדשה לרשימת תפוצה`
        },
        publicKey
      )

      setStatus({
        type: 'success',
        message: 'ההרשמה בוצעה בהצלחה! תודה שהצטרפת לרשימת התפוצה שלנו.'
      })
      setFormData({ name: '', email: '', phone: '' })
    } catch (error) {
      console.error('Error:', error)
      setStatus({
        type: 'error',
        message: 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 animate-fade-in">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">הרשמה לרשימת תפוצה</h1>
          <p className="section-subtitle">
            הצטרפו לרשימת התפוצה שלנו וקבלו עדכונים על זמני תפילה, שיעורים ואירועים מיוחדים
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <Mail className="mx-auto mb-3 text-primary-600" size={40} />
              <h3 className="font-bold text-slate-800 mb-2">עדכונים שוטפים</h3>
              <p className="text-sm text-slate-600">
                קבלו עדכונים על שינויים בזמני תפילה
              </p>
            </div>
            <div className="card text-center">
              <Mail className="mx-auto mb-3 text-gold-600" size={40} />
              <h3 className="font-bold text-slate-800 mb-2">אירועים מיוחדים</h3>
              <p className="text-sm text-slate-600">
                הודעות על סיומי מסכת ואירועים
              </p>
            </div>
            <div className="card text-center">
              <Mail className="mx-auto mb-3 text-primary-600" size={40} />
              <h3 className="font-bold text-slate-800 mb-2">שיעורי תורה</h3>
              <p className="text-sm text-slate-600">
                מידע על שיעורים חדשים ומיוחדים
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-slate-700 font-medium mb-2">
                  שם מלא *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="הכנס את שמך המלא"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-slate-700 font-medium mb-2">
                  כתובת אימייל *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-slate-700 font-medium mb-2">
                  מספר טלפון (אופציונלי)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="050-1234567"
                />
              </div>

              {/* Status Messages */}
              {status.message && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    status.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  ) : (
                    <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                  )}
                  <p
                    className={
                      status.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }
                  >
                    {status.message}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2"></div>
                    <span>שולח...</span>
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    <span>הרשם לרשימת התפוצה</span>
                  </>
                )}
              </button>

              <p className="text-sm text-slate-600 text-center">
                * שדות חובה. המידע שלך מאובטח ולא ישותף עם צדדים שלישיים.
              </p>
            </form>
          </div>

          {/* Privacy Note */}
          <div className="mt-8 p-6 bg-primary-50 border-r-4 border-primary-500 rounded-lg">
            <h3 className="font-bold text-slate-800 mb-2">פרטיות ואבטחה</h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              אנו מתחייבים לשמור על פרטיותך. כתובת האימייל שלך תשמש אך ורק לשליחת עדכונים
              מבית המדרש "חזון יוסף" ולא תועבר לגורמים חיצוניים. תוכל להסיר את עצמך מרשימת
              התפוצה בכל עת על ידי פנייה אלינו.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
