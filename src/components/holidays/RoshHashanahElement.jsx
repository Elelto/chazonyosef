import BaseHolidayElement from './BaseHolidayElement'

export default function RoshHashanahElement({ holidayData }) {
  return (
    <BaseHolidayElement label="שנה טובה ומתוקה">
      <svg viewBox="0 0 200 200" className="holiday-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shofarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#D2691E" />
            <stop offset="100%" stopColor="#F4A460" />
          </linearGradient>
          <radialGradient id="appleGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#8B0000" />
          </radialGradient>
        </defs>
        
        {/* Shofar */}
        <g>
          <path d="M40 150 Q60 160 100 120 Q140 80 160 40 L180 50 Q160 100 100 150 Q60 180 40 150" 
                fill="url(#shofarGradient)" stroke="#5D4037" strokeWidth="2" />
        </g>
        
        {/* Apple */}
        <g>
          <circle cx="60" cy="140" r="30" fill="url(#appleGradient)" />
          <path d="M60 110 Q50 100 60 90" stroke="green" strokeWidth="3" fill="none" />
          <path d="M60 90 Q70 80 80 90 Z" fill="green" />
        </g>
        
        {/* Honey pot */}
        <g>
          <path d="M120 160 L120 180 Q120 190 140 190 L160 190 Q180 190 180 180 L180 160 Z" fill="#FFD700" opacity="0.8" />
          <ellipse cx="150" cy="160" rx="30" ry="10" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
        </g>
      </svg>
    </BaseHolidayElement>
  )
}
