import BaseHolidayElement from './BaseHolidayElement'

export default function PesachElement({ holidayData }) {
  return (
    <BaseHolidayElement label="חג פסח כשר ושמח">
      <svg viewBox="0 0 200 200" className="holiday-svg" xmlns="http://www.w3.org/2000/svg">
        {/* Matzah */}
        <g>
          <circle cx="100" cy="100" r="70" fill="#FFE4B5" stroke="#DEB887" strokeWidth="2" />
          {/* Holes */}
          <circle cx="80" cy="80" r="2" fill="#DEB887" />
          <circle cx="120" cy="80" r="2" fill="#DEB887" />
          <circle cx="100" cy="100" r="2" fill="#DEB887" />
          <circle cx="80" cy="120" r="2" fill="#DEB887" />
          <circle cx="120" cy="120" r="2" fill="#DEB887" />
          <line x1="60" y1="60" x2="140" y2="140" stroke="#DEB887" strokeWidth="1" opacity="0.5" />
          <line x1="140" y1="60" x2="60" y2="140" stroke="#DEB887" strokeWidth="1" opacity="0.5" />
        </g>
        
        {/* Wine Cup */}
        <g>
          <path d="M140 140 L140 160 Q140 170 150 170 L170 170 Q180 170 180 160 L180 140 Q160 140 140 140 Z" fill="#800000" />
          {/* Liquid Reflection */}
          <path d="M145 145 Q160 150 175 145" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </BaseHolidayElement>
  )
}
