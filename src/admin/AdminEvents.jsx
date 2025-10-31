import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, Save, Edit2 } from 'lucide-react'

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    days: '',
    type: 'shiur'
  })
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    const saved = localStorage.getItem('events')
    if (saved) {
      setEvents(JSON.parse(saved))
    }
  }

  const handleAddOrUpdate = () => {
    if (!newEvent.title || !newEvent.time) {
      setMessage('נא למלא לפחות כותרת וזמן')
      return
    }

    if (editingId) {
      const updatedEvents = events.map(evt =>
        evt.id === editingId ? { ...newEvent, id: editingId } : evt
      )
      setEvents(updatedEvents)
      setMessage('אירוע עודכן בהצלחה!')
      setEditingId(null)
    } else {
      const eventToAdd = {
        id: Date.now(),
        ...newEvent
      }
      setEvents([...events, eventToAdd])
      setMessage('אירוע נוסף בהצלחה!')
    }

    setNewEvent({ title: '', description: '', time: '', days: '', type: 'shiur' })
    setTimeout(() => setMessage(''), 3000)
  }

  const handleEdit = (event) => {
    setNewEvent({
      title: event.title,
      description: event.description,
      time: event.time,
      days: event.days,
      type: event.type
    })
    setEditingId(event.id)
  }

  const handleDelete = (id) => {
    if (confirm('האם אתה בטוח שברצונך למחוק אירוע זה?')) {
      const updatedEvents = events.filter(evt => evt.id !== id)
      setEvents(updatedEvents)
      setMessage('אירוע נמחק בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem('events', JSON.stringify(events))
      setMessage('האירועים נשמרו בהצלחה!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      setMessage('שגיאה בשמירת האירועים')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Calendar className="text-primary-600" size={32} />
            ניהול אירועים ושיעורים
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
            {editingId ? 'ערוך אירוע' : 'הוסף אירוע חדש'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">כותרת *</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="input-field"
                placeholder="שם השיעור/אירוע"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">תיאור</label>
              <input
                type="text"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="input-field"
                placeholder="תיאור קצר"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2">זמן *</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">ימים</label>
                <input
                  type="text"
                  value={newEvent.days}
                  onChange={(e) => setNewEvent({ ...newEvent, days: e.target.value })}
                  className="input-field"
                  placeholder="לדוגמה: א׳, ג׳, ה׳"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">סוג</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="input-field"
              >
                <option value="shiur">שיעור</option>
                <option value="event">אירוע</option>
                <option value="tefilla">תפילה</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddOrUpdate}
                className="btn-secondary flex items-center gap-2"
              >
                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                {editingId ? 'עדכן אירוע' : 'הוסף אירוע'}
              </button>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null)
                    setNewEvent({ title: '', description: '', time: '', days: '', type: 'shiur' })
                  }}
                  className="px-4 py-2 bg-slate-300 hover:bg-slate-400 rounded-lg transition-colors"
                >
                  ביטול
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Events List */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            אירועים קיימים ({events.length})
          </h3>
          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="mx-auto mb-3" size={48} />
              <p>אין אירועים</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            event.type === 'shiur'
                              ? 'bg-primary-100 text-primary-700'
                              : event.type === 'event'
                              ? 'bg-gold-100 text-gold-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {event.type === 'shiur' ? 'שיעור' : event.type === 'event' ? 'אירוע' : 'תפילה'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                      )}
                      <div className="text-sm text-slate-500">
                        <span className="font-medium">{event.time}</span>
                        {event.days && <span> • {event.days}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 mr-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-primary-600 hover:text-primary-700 p-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
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

export default AdminEvents
