import './BaseHolidayElement.css'

export default function BaseHolidayElement({ children, label }) {
  return (
    <div className="holiday-element-container">
      <div className="holiday-content">
        {children}
        {label && (
          <div className="holiday-label">
            <span className="holiday-text">{label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
