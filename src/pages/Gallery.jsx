import { useState, useEffect } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      console.log('📥 Fetching gallery from Netlify Function...')
      const response = await fetch('/.netlify/functions/firebase-gallery')
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery')
      }
      
      const data = await response.json()
      const images = data.images || []
      console.log('✅ Gallery loaded:', images)
      setImages(images)
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching images:', error)
      // Fallback to localStorage if available
      const saved = localStorage.getItem('gallery')
      if (saved) {
        console.log('📦 Using cached gallery')
        setImages(JSON.parse(saved))
      }
      setLoading(false)
    }
  }

  if (loading) {
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
          <h1 className="section-title">גלריית תמונות</h1>
          <p className="section-subtitle">
            תמונות מבית המדרש, אירועים מיוחדים ופעילויות שוטפות
          </p>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="mx-auto mb-4 text-slate-400" size={64} />
            <p className="text-xl text-slate-600">אין תמונות להצגה כרגע</p>
            <p className="text-slate-500 mt-2">תמונות יתווספו בקרוב</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                    <p className="text-sm text-slate-200">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 p-6 bg-primary-50 border-r-4 border-primary-500 rounded-lg">
          <p className="text-slate-700">
            <strong>רוצים לשתף תמונות?</strong> אם יש לכם תמונות מאירועים בבית המדרש,
            נשמח אם תשתפו אותנו! צרו איתנו קשר דרך דף "צור קשר".
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 left-4 text-white hover:text-gold-400 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl w-full">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-slate-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
