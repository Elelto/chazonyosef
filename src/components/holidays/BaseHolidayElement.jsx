import './BaseHolidayElement.css'

export default function BaseHolidayElement({ children, label }) {
  return (
    <div className="holiday-element-container">
      <div className="holiday-content">
        {children}
      </div>
    </div>
  )
}
