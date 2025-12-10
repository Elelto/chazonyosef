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

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const data = await fetchFromFirebase('firebase-contact-page')
      if (data.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error loading contact page content:', error)
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
        message: content?.form.successMessage || 'ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.'
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Error:', error)
      setStatus({
        type: 'error',
        message: content?.form.errorMessage || 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="py-12 animate-fade-in">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">{content.header.title}</h1>
          <p className="section-subtitle">
            {content.header.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{content.contactInfo.title}</h2>
            
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
                      {content.contactInfo.address.street}<br />
                      {content.contactInfo.address.city}, {content.contactInfo.address.country}
                    </p>
                    <a
                      href={content.contactInfo.address.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline mt-2 inline-block"
                    >
                      {content.contactInfo.address.mapLinkText}
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
                      href={`tel:${content.contactInfo.phone.number}`}
                      className="text-slate-600 hover:text-gold-600 transition-colors"
                    >
                      {content.contactInfo.phone.display}
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
                      href={`mailto:${content.contactInfo.email.address}`}
                      className="text-slate-600 hover:text-primary-600 transition-colors"
                    >
                      {content.contactInfo.email.display}
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
                      <p>{content.contactInfo.hours.weekdays}</p>
                      <p>{content.contactInfo.hours.shabbat}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 card">
              <h3 className="font-bold text-slate-800 mb-4">{content.map.title}</h3>
              <div className="bg-slate-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <MapPin className="mx-auto mb-2" size={48} />
                  <p>{content.map.placeholder}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{content.form.title}</h2>
            
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-slate-700 font-medium mb-2">
                    {content.form.nameLabel} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={content.form.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-slate-700 font-medium mb-2">
                    {content.form.emailLabel} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={content.form.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-slate-700 font-medium mb-2">
                    {content.form.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={content.form.phonePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-slate-700 font-medium mb-2">
                    {content.form.messageLabel} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="input-field resize-none"
                    placeholder={content.form.messagePlaceholder}
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
                      <span>{content.form.submittingButton}</span>
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      <span>{content.form.submitButton}</span>
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
