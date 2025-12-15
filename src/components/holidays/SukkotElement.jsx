import BaseHolidayElement from './BaseHolidayElement'

export default function SukkotElement({ holidayData }) {
  return (
    <BaseHolidayElement label="חג סוכות שמח">
      <svg viewBox="0 0 200 200" className="holiday-svg" xmlns="http://www.w3.org/2000/svg">
        {/* Lulav */}
        <g>
          <path d="M100 180 L100 40 Q100 20 105 40 L105 180 Z" fill="#228B22" stroke="#006400" />
          
          {/* Hadasim & Aravot */}
          <path d="M90 170 L80 100 Q75 90 85 100 L95 170 Z" fill="#32CD32" />
          <path d="M110 170 L120 100 Q125 90 115 100 L105 170 Z" fill="#32CD32" />
        </g>
        
        {/* Etrog */}
        <g>
          <ellipse cx="70" cy="150" rx="20" ry="25" fill="#FFD700" stroke="#DAA520" />
          <path d="M70 125 Q70 120 75 120" stroke="#DAA520" fill="none" />
        </g>
      </svg>
    </BaseHolidayElement>
  )
}
