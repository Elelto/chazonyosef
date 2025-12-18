import { useState, useEffect } from 'react'
import { Image as ImageIcon, X, Tag, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('הכל')
  const [filterTag, setFilterTag] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

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
      const saved = localStorage.getItem('gallery')
      if (saved) {
        console.log('📦 Using cached gallery')
        setImages(JSON.parse(saved))
      }
      setLoading(false)
    }
  }

  const getFilteredImages = () => {
    let filtered = images
    
    if (filterCategory !== 'הכל') {
      filtered = filtered.filter(img => img.category === filterCategory)
    }
    
    if (filterTag) {
      filtered = filtered.filter(img => 
        Array.isArray(img.tags) && img.tags.some(tag => 
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    }
    
    return filtered
  }

  const getAllCategories = () => {
    const categories = new Set()
    images.forEach(img => {
      if (img.category) categories.add(img.category)
    })
    return Array.from(categories).sort()
  }

  const getAllTags = () => {
    const tagsSet = new Set()
    images.forEach(img => {
      if (Array.isArray(img.tags)) {
        img.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  }

  const handleImageClick = (image, index) => {
    setSelectedImage(image)
    setSelectedIndex(index)
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    const filtered = getFilteredImages()
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : filtered.length - 1
    setSelectedIndex(newIndex)
    setSelectedImage(filtered[newIndex])
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    const filtered = getFilteredImages()
    const newIndex = selectedIndex < filtered.length - 1 ? selectedIndex + 1 : 0
    setSelectedIndex(newIndex)
    setSelectedImage(filtered[newIndex])
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
        <div className="text-center mb-8">
          <h1 className="section-title">גלריית תמונות</h1>
          <p className="section-subtitle">
            תמונות מבית המדרש, אירועים מיוחדים ופעילויות שוטפות
          </p>
        </div>

        {/* Filters */}
        {images.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-primary-600" />
              <h3 className="text-lg font-bold text-slate-800">סינון תמונות</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  לפי קטגוריה
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="הכל">הכל ({images.length})</option>
                  {getAllCategories().map(cat => {
                    const count = images.filter(img => img.category === cat).length
                    return (
                      <option key={cat} value={cat}>{cat} ({count})</option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  חיפוש לפי תגית
                </label>
                <input
                  type="text"
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  placeholder="הקלד תגית..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {getAllTags().length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getAllTags().slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                מציג <strong className="text-primary-600">{getFilteredImages().length}</strong> תמונות
                {(filterCategory !== 'הכל' || filterTag) && (
                  <>
                    {' '}מתוך <strong>{images.length}</strong>
                    <button
                      onClick={() => {
                        setFilterCategory('הכל')
                        setFilterTag('')
                      }}
                      className="mr-2 text-primary-600 hover:text-primary-700 underline"
                    >
                      איפוס סינון
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="mx-auto mb-4 text-slate-400" size={64} />
            <p className="text-xl text-slate-600">אין תמונות להצגה כרגע</p>
            <p className="text-slate-500 mt-2">תמונות יתווספו בקרוב</p>
          </div>
        ) : getFilteredImages().length === 0 ? (
          <div className="text-center py-20">
            <Filter className="mx-auto mb-4 text-slate-400" size={64} />
            <p className="text-xl text-slate-600">לא נמצאו תמונות תואמות</p>
            <p className="text-slate-500 mt-2">נסה סינון אחר</p>
            <button
              onClick={() => {
                setFilterCategory('הכל')
                setFilterTag('')
              }}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              איפוס סינון
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredImages().map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleImageClick(image, index)}
              >
                <img
                  src={image.urls?.medium || image.url}
                  srcSet={image.urls ? `
                    ${image.urls.thumb} 400w,
                    ${image.urls.medium} 800w,
                    ${image.urls.large} 1600w
                  ` : undefined}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={image.title}
                  loading="lazy"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {image.category && (
                  <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                    {image.category}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-slate-200 mb-2 line-clamp-2">{image.description}</p>
                    )}
                    {Array.isArray(image.tags) && image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className="text-xs text-slate-300">+{image.tags.length - 3}</span>
                        )}
                      </div>
                    )}
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
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 left-4 text-white hover:text-primary-400 transition-colors z-10 bg-black/50 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>

          {getFilteredImages().length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors z-10 bg-black/50 p-3 rounded-full"
              >
                <ChevronRight size={32} />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors z-10 bg-black/50 p-3 rounded-full"
              >
                <ChevronLeft size={32} />
              </button>

              <div className="absolute top-4 right-1/2 translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {selectedIndex + 1} / {getFilteredImages().length}
              </div>
            </>
          )}

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.urls?.large || selectedImage.url}
              alt={selectedImage.title}
              loading="eager"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-slate-300 text-lg">{selectedImage.description}</p>
                  )}
                </div>
                {selectedImage.category && (
                  <span className="bg-primary-600 text-white text-sm px-4 py-2 rounded-full whitespace-nowrap">
                    {selectedImage.category}
                  </span>
                )}
              </div>

              {Array.isArray(selectedImage.tags) && selectedImage.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={16} className="text-slate-400" />
                  {selectedImage.tags.map((tag, i) => (
                    <span key={i} className="text-sm bg-white/20 text-white px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
