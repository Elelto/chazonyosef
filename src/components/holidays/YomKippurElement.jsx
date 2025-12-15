import BaseHolidayElement from './BaseHolidayElement'

export default function YomKippurElement({ holidayData }) {
  return (
    <BaseHolidayElement label="גמר חתימה טובה">
      <svg viewBox="0 0 200 200" className="holiday-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F0F0" />
          </linearGradient>
        </defs>
        
        {/* Main Group */}
        <g>
          {/* Torah Scroll */}
          <rect x="60" y="40" width="10" height="140" rx="5" fill="#8B4513" />
          <rect x="130" y="40" width="10" height="140" rx="5" fill="#8B4513" />
          
          {/* Scroll Body */}
          <path d="M70 50 Q100 40 130 50 L130 170 Q100 160 70 170 Z" fill="url(#whiteGradient)" stroke="#D3D3D3" />
          
          {/* Text Lines */}
          <g>
            <line x1="80" y1="70" x2="120" y2="70" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="80" y1="90" x2="120" y2="90" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="80" y1="110" x2="120" y2="110" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="80" y1="130" x2="120" y2="130" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
          </g>
          
          {/* Tallit Stripes hint */}
          <rect x="70" y="150" width="60" height="5" fill="#000080" opacity="0.8" />
        </g>
      </svg>
    </BaseHolidayElement>
  )
}
