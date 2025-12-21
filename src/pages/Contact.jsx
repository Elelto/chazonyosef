import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { fetchFromFirebase } from '../utils/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(null)
  const [contentLoading, setContentLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const data = await fetchFromFirebase('firebase-contact-page')
      if (data?.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error loading contact page content:', error)
    } finally {
      setContentLoading(false)
    }
  }

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
        message: pageContent?.form.successMessage || 'ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.'
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Error:', error)
      setStatus({
        type: 'error',
        message: pageContent?.form.errorMessage || 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.'
      })
    } finally {
      setLoading(false)
    }
  }

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // Default content if not loaded from Firebase
  const defaultContent = {
    header: {
      title: 'צור קשר',
      subtitle: 'נשמח לשמוע ממך! השאר לנו הודעה ונחזור אליך בהקדם'
    },
    contactInfo: {
      address: 'בעל התניא 26, בני ברק',
      phone: '03-1234567',
      email: 'info@chazonyosef.org'
    },
    form: {
      namePlaceholder: 'שם מלא',
      emailPlaceholder: 'כתובת אימייל',
      phonePlaceholder: 'טלפון',
      messagePlaceholder: 'הודעה',
      submitButton: 'שלח הודעה',
      successMessage: 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.',
      errorMessage: 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.'
    }
  }

  const pageContent = content || defaultContent

  return (
    <div className="py-12 animate-fade-in">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">{pageContent.header.title}</h1>
          <p className="section-subtitle">
            {pageContent.header.subtitle}
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
                      {pageContent.contactInfo.address}
                    </p>
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
                      href={`tel:${pageContent.contactInfo.phone}`}
                      className="text-slate-600 hover:text-gold-600 transition-colors"
                    >
                      {pageContent.contactInfo.phone}
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
                      href={`mailto:${pageContent.contactInfo.email}`}
                      className="text-slate-600 hover:text-primary-600 transition-colors"
                    >
                      {pageContent.contactInfo.email}
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
                      <p>ימים א'-ה': 6:00-23:00</p>
                      <p>שבת: סגור</p>
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
                    placeholder={pageContent.form.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-slate-700 font-medium mb-2">
                    אימייל *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={pageContent.form.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-slate-700 font-medium mb-2">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={pageContent.form.phonePlaceholder}
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
                    placeholder={pageContent.form.messagePlaceholder}
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
                      <span>{pageContent.form.submitButton}</span>
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
