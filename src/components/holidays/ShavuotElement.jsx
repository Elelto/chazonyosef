import BaseHolidayElement from './BaseHolidayElement'

export default function ShavuotElement({ holidayData }) {
  return (
    <BaseHolidayElement label="חג שבועות שמח">
      <svg viewBox="0 0 200 200" className="holiday-svg" xmlns="http://www.w3.org/2000/svg">
        {/* Tablets */}
        <g>
          <path d="M60 40 Q80 20 100 40 L100 140 L60 140 Z" fill="#D3D3D3" stroke="#A9A9A9" />
          <path d="M100 40 Q120 20 140 40 L140 140 L100 140 Z" fill="#D3D3D3" stroke="#A9A9A9" />
          
          {/* Subtle Text Lines */}
          <line x1="70" y1="60" x2="90" y2="60" stroke="#999" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="110" y1="60" x2="130" y2="60" stroke="#999" strokeWidth="1" strokeDasharray="2,2" />
        </g>
        
        {/* Flowers */}
        <g>
          <circle cx="60" cy="140" r="10" fill="pink" />
          <circle cx="140" cy="140" r="10" fill="pink" />
          <circle cx="100" cy="160" r="15" fill="lightgreen" opacity="0.5" />
        </g>
      </svg>
    </BaseHolidayElement>
  )
}
