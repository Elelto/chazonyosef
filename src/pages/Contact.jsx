import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
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
          message: formData.message
        },
        publicKey
      )

      setStatus({
        type: 'success',
        message: 'ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.'
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Error:', error)
      setStatus({
        type: 'error',
        message: 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.'
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
          <h1 className="section-title">צור קשר</h1>
          <p className="section-subtitle">
            נשמח לשמוע ממך! צור איתנו קשר בכל שאלה, הצעה או בקשה
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">פרטי התקשרות</h2>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                    <MapPin className="text-primary-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">כתובת</h3>
                    <p className="text-slate-600">
                      בעל התניא 26<br />
                      בני ברק, ישראל
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=בעל+התניא+26+בני+ברק"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline mt-2 inline-block"
                    >
                      פתח ב-Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gold-100 p-3 rounded-lg flex-shrink-0">
                    <Phone className="text-gold-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">טלפון</h3>
                    <a
                      href="tel:***-***-****"
                      className="text-slate-600 hover:text-gold-600 transition-colors"
                    >
                      ***-***-****
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                    <Mail className="text-primary-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">אימייל</h3>
                    <a
                      href="mailto:***@***.com"
                      className="text-slate-600 hover:text-primary-600 transition-colors"
                    >
                      ***@***.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gold-100 p-3 rounded-lg flex-shrink-0">
                    <Clock className="text-gold-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">שעות פעילות</h3>
                    <div className="text-slate-600 space-y-1">
                      <p>ימי חול: 6:00 - 22:00</p>
                      <p>שבת: לפי זמני התפילות</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 card">
              <h3 className="font-bold text-slate-800 mb-4">מיקום</h3>
              <div className="bg-slate-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <MapPin className="mx-auto mb-2" size={48} />
                  <p>מפה תתווסף בקרוב</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">שלח לנו הודעה</h2>
            
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
                    מספר טלפון
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

                <div>
                  <label htmlFor="message" className="block text-slate-700 font-medium mb-2">
                    הודעה *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="input-field resize-none"
                    placeholder="כתוב את הודעתך כאן..."
                  ></textarea>
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
                      <span>שלח הודעה</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
