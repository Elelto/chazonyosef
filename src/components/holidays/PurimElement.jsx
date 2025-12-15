import BaseHolidayElement from './BaseHolidayElement'

export default function PurimElement({ holidayData }) {
  return (
    <BaseHolidayElement label="חג פורים שמח">
      <svg viewBox="0 0 200 200" className="holiday-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="maskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9370DB" />
            <stop offset="100%" stopColor="#8A2BE2" />
          </linearGradient>
        </defs>
        
        {/* Mask */}
        <g>
          <path d="M40 80 Q70 40 100 80 Q130 40 160 80 Q160 130 100 140 Q40 130 40 80 Z" 
                fill="url(#maskGradient)" stroke="#4B0082" strokeWidth="2" />
          
          {/* Eyes */}
          <ellipse cx="70" cy="85" rx="15" ry="10" fill="#FFFFFF" />
          <ellipse cx="130" cy="85" rx="15" ry="10" fill="#FFFFFF" />
          
          {/* Decorations */}
          <g>
            <circle cx="40" cy="80" r="5" fill="#FFD700" />
            <circle cx="160" cy="80" r="5" fill="#FFD700" />
          </g>
        </g>
        
        {/* Confetti */}
        <g>
          <circle cx="20" cy="40" r="3" fill="red" />
          <circle cx="180" cy="160" r="3" fill="blue" />
          <circle cx="100" cy="20" r="3" fill="green" />
          <circle cx="50" cy="180" r="3" fill="yellow" />
        </g>
      </svg>
    </BaseHolidayElement>
  )
}
