import { useState, useEffect } from 'react'
import { Image, Plus, Trash2, Save, Upload } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'

const AdminGallery = () => {
  const [images, setImages] = useState([])
  const [newImage, setNewImage] = useState({ url: '', title: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      console.log('📥 Loading gallery via Netlify Function...')
      const data = await fetchFromFirebase('firebase-gallery')
      const images = data.images || []
      console.log('✅ Gallery loaded:', images)
      setImages(images)
      localStorage.setItem('gallery', JSON.stringify(images))
    } catch (error) {
      console.error('❌ Error loading gallery:', error)
      const saved = localStorage.getItem('gallery')
      if (saved) {
        console.log('📦 Loaded from localStorage fallback')
        setImages(JSON.parse(saved))
      }
    }
  }

  const handleAddImage = () => {
    if (!newImage.url || !newImage.title) {
      setMessage('נא למלא לפחות URL וכותרת')
      return
    }

    const imageToAdd = {
      id: Date.now(),
      ...newImage
    }

    const updatedImages = [...images, imageToAdd]
    setImages(updatedImages)
    setNewImage({ url: '', title: '', description: '' })
    setMessage('תמונה נוספה בהצלחה!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDeleteImage = (id) => {
    if (confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) {
      const updatedImages = images.filter(img => img.id !== id)
      setImages(updatedImages)
      setMessage('תמונה נמחקה בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    console.log('💾 Saving gallery via Netlify Function...', images)
    
    try {
      await saveToFirebase('firebase-gallery', { images })
      
      localStorage.setItem('gallery', JSON.stringify(images))
      setMessage('✅ הגלריה נשמרה בהצלחה!')
      console.log('✅ Gallery saved successfully')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving gallery:', error)
      setMessage('שגיאה בשמירת הגלריה: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Image className="text-primary-600" size={32} />
            ניהול גלריה
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {message}
          </div>
        )}

        {/* Add New Image */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">הוסף תמונה חדשה</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                URL של התמונה *
              </label>
              <input
                type="url"
                value={newImage.url}
                onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-slate-500 mt-1">
                העלה תמונה לשירות אחסון (Cloudinary, Imgur וכו') והדבק את ה-URL כאן
              </p>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                כותרת *
              </label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                className="input-field"
                placeholder="כותרת התמונה"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                תיאור
              </label>
              <input
                type="text"
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                className="input-field"
                placeholder="תיאור קצר של התמונה"
              />
            </div>
            <button
              onClick={handleAddImage}
              className="btn-secondary flex items-center gap-2"
            >
              <Upload size={18} />
              הוסף תמונה
            </button>
          </div>
        </div>

        {/* Images Grid */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            תמונות קיימות ({images.length})
          </h3>
          {images.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Image className="mx-auto mb-3" size={48} />
              <p>אין תמונות בגלריה</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-4">
                    <h4 className="text-white font-bold mb-1 text-center">{image.title}</h4>
                    <p className="text-white/80 text-sm text-center mb-3">{image.description}</p>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      מחק
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminGallery
