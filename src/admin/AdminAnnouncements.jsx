import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Trash2, Save, Edit2 } from 'lucide-react'

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal' })
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = () => {
    const saved = localStorage.getItem('announcements')
    if (saved) {
      setAnnouncements(JSON.parse(saved))
    }
  }

  const handleAddOrUpdate = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      setMessage('נא למלא כותרת ותוכן')
      return
    }

    if (editingId) {
      // Update existing
      const updatedAnnouncements = announcements.map(ann =>
        ann.id === editingId ? { ...newAnnouncement, id: editingId } : ann
      )
      setAnnouncements(updatedAnnouncements)
      setMessage('הודעה עודכנה בהצלחה!')
      setEditingId(null)
    } else {
      // Add new
      const announcementToAdd = {
        id: Date.now(),
        ...newAnnouncement,
        date: new Date().toISOString()
      }
      setAnnouncements([announcementToAdd, ...announcements])
      setMessage('הודעה נוספה בהצלחה!')
    }

    setNewAnnouncement({ title: '', content: '', priority: 'normal' })
    setTimeout(() => setMessage(''), 3000)
  }

  const handleEdit = (announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority
    })
    setEditingId(announcement.id)
  }

  const handleDelete = (id) => {
    if (confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) {
      const updatedAnnouncements = announcements.filter(ann => ann.id !== id)
      setAnnouncements(updatedAnnouncements)
      setMessage('הודעה נמחקה בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem('announcements', JSON.stringify(announcements))
      setMessage('ההודעות נשמרו בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      setMessage('שגיאה בשמירת ההודעות')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <MessageSquare className="text-primary-600" size={32} />
            ניהול הודעות
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

        {/* Add/Edit Form */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {editingId ? 'ערוך הודעה' : 'הוסף הודעה חדשה'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת *</label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="input-field"
                placeholder="כותרת ההודעה"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">תוכן *</label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="input-field resize-none"
                rows="4"
                placeholder="תוכן ההודעה"
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">עדיפות</label>
              <select
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                className="input-field"
              >
                <option value="low">נמוכה</option>
                <option value="normal">רגילה</option>
                <option value="high">גבוהה</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddOrUpdate}
                className="btn-secondary flex items-center gap-2"
              >
                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                {editingId ? 'עדכן הודעה' : 'הוסף הודעה'}
              </button>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null)
                    setNewAnnouncement({ title: '', content: '', priority: 'normal' })
                  }}
                  className="px-4 py-2 bg-slate-300 hover:bg-slate-400 rounded-lg transition-colors"
                >
                  ביטול
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            הודעות קיימות ({announcements.length})
          </h3>
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="mx-auto mb-3" size={48} />
              <p>אין הודעות</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-lg border-r-4 ${
                    announcement.priority === 'high'
                      ? 'bg-red-50 border-red-500'
                      : announcement.priority === 'low'
                      ? 'bg-slate-50 border-slate-400'
                      : 'bg-primary-50 border-primary-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 mb-2">{announcement.title}</h4>
                      <p className="text-slate-600 mb-2">{announcement.content}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(announcement.date).toLocaleDateString('he-IL')}
                      </p>
                    </div>
                    <div className="flex gap-2 mr-4">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="text-primary-600 hover:text-primary-700 p-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default AdminAnnouncements
