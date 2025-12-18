import { useState, useEffect, useRef } from 'react'
import { Image, Plus, Trash2, Save, Upload, Edit2, X, GripVertical, Check, Tag, Filter } from 'lucide-react'
import { fetchFromFirebase, saveToFirebase } from '../utils/api'
import { storage } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import imageCompression from 'browser-image-compression'

const CATEGORIES = ['אירועים', 'בית המדרש', 'שיעורים', 'חגים', 'פעילויות', 'אחר']

const AdminGallery = () => {
  const [images, setImages] = useState([])
  const [newImage, setNewImage] = useState({ url: '', title: '', description: '', category: '', tags: '' })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ title: '', description: '', category: '', tags: '' })
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [filterCategory, setFilterCategory] = useState('הכל')
  const [filterTag, setFilterTag] = useState('')
  const fileInputRef = useRef(null)

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

  const compressImageToSize = async (file, maxSize, sizeName) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: maxSize,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.85
    }
    
    try {
      const compressedFile = await imageCompression(file, options)
      console.log(`🗜️ ${sizeName}: ${maxSize}px → ${(compressedFile.size / 1024).toFixed(0)}KB`)
      return compressedFile
    } catch (error) {
      console.error(`Compression error (${sizeName}):`, error)
      return file
    }
  }

  const generateResponsiveImages = async (file) => {
    const sizes = [
      { name: 'thumb', maxSize: 400 },
      { name: 'medium', maxSize: 800 },
      { name: 'large', maxSize: 1600 }
    ]

    const results = {}
    const originalSize = (file.size / 1024 / 1024).toFixed(2)
    console.log(`📸 מעבד תמונה (${originalSize}MB) → 3 גרסאות...`)

    for (const size of sizes) {
      results[size.name] = await compressImageToSize(file, size.maxSize, size.name)
    }

    const totalSize = Object.values(results).reduce((sum, f) => sum + f.size, 0)
    const savings = ((1 - totalSize / file.size) * 100).toFixed(0)
    console.log(`✅ סה"כ: ${(totalSize / 1024 / 1024).toFixed(2)}MB (${savings}% חיסכון)`)

    return results
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles = []
    const previews = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setMessage('❌ נא לבחור קבצי תמונה בלבד')
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        setMessage('❌ גודל הקובץ חייב להיות פחות מ-10MB')
        continue
      }
      validFiles.push(file)
      
      const reader = new FileReader()
      const previewPromise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      previews.push(previewPromise)
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles)
      const resolvedPreviews = await Promise.all(previews)
      setPreviewUrls(resolvedPreviews)
      setMessage(`✅ נבחרו ${validFiles.length} תמונות`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length === 0) return

    const validFiles = []
    const previews = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setMessage('❌ נא לבחור קבצי תמונה בלבד')
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        setMessage('❌ גודל הקובץ חייב להיות פחות מ-10MB')
        continue
      }
      validFiles.push(file)
      
      const reader = new FileReader()
      const previewPromise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      previews.push(previewPromise)
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles)
      const resolvedPreviews = await Promise.all(previews)
      setPreviewUrls(resolvedPreviews)
      setMessage(`✅ נבחרו ${validFiles.length} תמונות`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) {
      setMessage('❌ נא לבחור תמונות להעלאה')
      return
    }
    if (!newImage.title && selectedFiles.length === 1) {
      setMessage('❌ נא למלא כותרת לתמונה')
      return
    }

    setUploading(true)
    setCompressing(true)
    const progressMap = {}

    try {
      const uploadedImages = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const fileId = `file_${i}`
        
        progressMap[fileId] = 0
        setUploadProgress({...progressMap})

        const responsiveImages = await generateResponsiveImages(file)
        setCompressing(false)
        
        const timestamp = Date.now() + i
        const baseFileName = file.name.replace(/\.[^/.]+$/, '')
        const urls = {}
        const storagePaths = {}

        // העלאת 3 הגרסאות
        for (const [sizeName, compressedFile] of Object.entries(responsiveImages)) {
          const fileName = `gallery/${timestamp}_${baseFileName}_${sizeName}.webp`
          const storageRef = ref(storage, fileName)
          const uploadTask = uploadBytesResumable(storageRef, compressedFile)

          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                const sizeProgress = progress / 3 // מחלקים ל-3 כי יש 3 גרסאות
                const baseProgress = (Object.keys(urls).length / 3) * 100
                progressMap[fileId] = baseProgress + sizeProgress
                setUploadProgress({...progressMap})
              },
              (error) => {
                console.error(`Upload error (${sizeName}):`, error)
                reject(error)
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                urls[sizeName] = downloadURL
                storagePaths[sizeName] = fileName
                resolve()
              }
            )
          })
        }

        const imageToAdd = {
          id: timestamp,
          urls: urls,
          storagePaths: storagePaths,
          title: selectedFiles.length === 1 ? newImage.title : `תמונה ${i + 1}`,
          description: selectedFiles.length === 1 ? newImage.description : '',
          category: newImage.category || 'אחר',
          tags: newImage.tags ? newImage.tags.split(',').map(t => t.trim()).filter(t => t) : [],
          uploadedAt: new Date().toISOString()
        }

        uploadedImages.push(imageToAdd)
        console.log(`✅ תמונה ${i + 1} הועלתה בהצלחה עם 3 גרסאות`)
      }

      const updatedImages = [...images, ...uploadedImages]
      setImages(updatedImages)
      setNewImage({ url: '', title: '', description: '', category: '', tags: '' })
      setSelectedFiles([])
      setPreviewUrls([])
      setUploadProgress({})
      setUploading(false)
      setMessage(`✅ ${uploadedImages.length} תמונות הועלו בהצלחה!`)
      setTimeout(() => setMessage(''), 3000)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setMessage('❌ שגיאה בהעלאת התמונות')
      setUploading(false)
      setCompressing(false)
    }
  }

  const handleDeleteImage = async (id) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) {
      return
    }

    try {
      const imageToDelete = images.find(img => img.id === id)
      
      // מחיקת כל 3 הגרסאות
      if (imageToDelete?.storagePaths) {
        for (const [sizeName, path] of Object.entries(imageToDelete.storagePaths)) {
          try {
            const storageRef = ref(storage, path)
            await deleteObject(storageRef)
            console.log(`🗑️ נמחק: ${sizeName}`)
          } catch (err) {
            console.warn(`Failed to delete ${sizeName}:`, err)
          }
        }
      } else if (imageToDelete?.storagePath) {
        // תמיכה לאחור בתמונות ישנות
        const storageRef = ref(storage, imageToDelete.storagePath)
        await deleteObject(storageRef)
      }
      
      const updatedImages = images.filter(img => img.id !== id)
      setImages(updatedImages)
      setMessage('✅ תמונה נמחקה בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting image:', error)
      setMessage('❌ שגיאה במחיקת התמונה')
    }
  }

  const handleEditImage = (image) => {
    setEditingId(image.id)
    setEditData({ 
      title: image.title, 
      description: image.description || '',
      category: image.category || 'אחר',
      tags: Array.isArray(image.tags) ? image.tags.join(', ') : ''
    })
  }

  const handleSaveEdit = () => {
    const updatedImages = images.map(img => 
      img.id === editingId 
        ? { 
            ...img, 
            title: editData.title, 
            description: editData.description,
            category: editData.category,
            tags: editData.tags ? editData.tags.split(',').map(t => t.trim()).filter(t => t) : []
          }
        : img
    )
    setImages(updatedImages)
    setEditingId(null)
    setEditData({ title: '', description: '', category: '', tags: '' })
    setMessage('✅ התמונה עודכנה בהצלחה!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({ title: '', description: '', category: '', tags: '' })
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

  const getAllTags = () => {
    const tagsSet = new Set()
    images.forEach(img => {
      if (Array.isArray(img.tags)) {
        img.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  }

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragEnter = (index) => {
    if (draggedIndex === null || draggedIndex === index) return
    
    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)
    
    setImages(newImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
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
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-slate-100 transition-colors"
            >
              {previewUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const newFiles = selectedFiles.filter((_, i) => i !== index)
                          const newPreviews = previewUrls.filter((_, i) => i !== index)
                          setSelectedFiles(newFiles)
                          setPreviewUrls(newPreviews)
                          if (newFiles.length === 0 && fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto mb-3 text-slate-400" size={48} />
                  <p className="text-slate-600 font-medium mb-1">
                    לחץ לבחירת תמונות או גרור תמונות לכאן
                  </p>
                  <p className="text-sm text-slate-500">
                    ניתן לבחור מספר תמונות בבת אחת • קבצים מותרים: JPG, PNG, GIF (עד 10MB)
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    🗜️ כל תמונה תיווצר ב-3 גרסאות (400px, 800px, 1600px) בפורמט WebP
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    📱 מובייל יקבל גרסה קטנה • 💻 דסקטופ יקבל גרסה גדולה
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Compression & Upload Progress */}
            {compressing && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
                  <span>🗜️ דוחס תמונות...</span>
                </div>
              </div>
            )}
            {uploading && !compressing && (
              <div className="space-y-2">
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div key={fileId}>
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>מעלה תמונה {fileId.replace('file_', parseInt(fileId.replace('file_', '')) + 1)}...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  כותרת {selectedFiles.length === 1 && '*'}
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  className="input-field"
                  placeholder={selectedFiles.length > 1 ? 'אופציונלי להעלאה מרובה' : 'כותרת התמונה'}
                  disabled={uploading}
                />
                {selectedFiles.length > 1 && (
                  <p className="text-xs text-slate-500 mt-1">כותרות אוטומטיות: "תמונה 1", "תמונה 2"...</p>
                )}
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2 flex items-center gap-2">
                  <Tag size={16} />
                  קטגוריה
                </label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="input-field"
                  disabled={uploading}
                >
                  <option value="">בחר קטגוריה...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                תיאור
              </label>
              <textarea
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                className="input-field"
                placeholder="תיאור קצר של התמונה"
                rows="2"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2 flex items-center gap-2">
                <Tag size={16} />
                תגיות (מופרדות בפסיק)
              </label>
              <input
                type="text"
                value={newImage.tags}
                onChange={(e) => setNewImage({ ...newImage, tags: e.target.value })}
                className="input-field"
                placeholder="לדוגמה: שבת, חנוכה, שיעור"
                disabled={uploading}
              />
              <p className="text-xs text-slate-500 mt-1">תגיות עוזרות לסנן ולמצוא תמונות בקלות</p>
            </div>
            <button
              onClick={handleUploadImages}
              disabled={selectedFiles.length === 0 || uploading}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={18} />
              {uploading ? 'מעלה...' : compressing ? 'דוחס...' : `העלה ${selectedFiles.length > 0 ? selectedFiles.length : ''} תמונות`}
            </button>
          </div>
        </div>

        {/* Filters */}
        {images.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} className="text-slate-600" />
              <h3 className="font-bold text-slate-800">סינון תמונות</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  לפי קטגוריה
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="הכל">הכל ({images.length})</option>
                  {CATEGORIES.map(cat => {
                    const count = images.filter(img => img.category === cat).length
                    return count > 0 ? (
                      <option key={cat} value={cat}>{cat} ({count})</option>
                    ) : null
                  })}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  לפי תגית
                </label>
                <input
                  type="text"
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="input-field"
                  placeholder="חפש תגית..."
                />
                {getAllTags().length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getAllTags().slice(0, 10).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Images Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              תמונות קיימות ({getFilteredImages().length}{filterCategory !== 'הכל' || filterTag ? ` מתוך ${images.length}` : ''})
            </h3>
            {images.length > 0 && (
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <GripVertical size={16} />
                גרור תמונות לסידור מחדש
              </p>
            )}
          </div>
          {images.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Image className="mx-auto mb-3" size={48} />
              <p>אין תמונות בגלריה</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredImages().map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-2 right-2 z-10 bg-white/90 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={20} className="text-slate-600" />
                  </div>

                  <img
                    src={image.urls?.medium || image.url}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {editingId === image.id ? (
                    <div className="absolute inset-0 bg-white rounded-lg p-3 flex flex-col overflow-y-auto">
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="input-field mb-2 text-sm"
                        placeholder="כותרת"
                      />
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="input-field mb-2 text-sm"
                      >
                        <option value="">בחר קטגוריה...</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={editData.tags}
                        onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                        className="input-field mb-2 text-sm"
                        placeholder="תגיות (מופרדות בפסיק)"
                      />
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="input-field mb-2 text-sm"
                        placeholder="תיאור"
                        rows="2"
                      />
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1"
                        >
                          <Check size={12} />
                          שמור
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-slate-500 hover:bg-slate-600 text-white px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1"
                        >
                          <X size={12} />
                          ביטול
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-4">
                      <h4 className="text-white font-bold mb-1 text-center">{image.title}</h4>
                      {image.category && (
                        <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded mb-1">{image.category}</span>
                      )}
                      {Array.isArray(image.tags) && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center mb-2">
                          {image.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-white/80 text-sm text-center mb-3">{image.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditImage(image)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1"
                        >
                          <Edit2 size={14} />
                          ערוך
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          מחק
                        </button>
                      </div>
                    </div>
                  )}
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
