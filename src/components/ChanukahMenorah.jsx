import { useEffect, useState } from 'react'
import { getCurrentChanukahDay } from '../utils/hebrewCalendar'
import './ChanukahMenorah.css'

export default function ChanukahMenorah({ forceActive = false }) {
  const [currentDay, setCurrentDay] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Check if it's Chanukah
    const day = getCurrentChanukahDay()
    if (day > 0) {
      setIsActive(true)
      setCurrentDay(day)
    } else if (forceActive) {
      setIsActive(true)
      setCurrentDay(8) // Show full menorah in preview
    }
  }, [forceActive])

  // For testing purposes, uncomment to force show menorah with all candles
  // useEffect(() => { setIsActive(true); setCurrentDay(8); }, [])

  if (!isActive) return null

  const Flame = ({ delay = 0 }) => (
    <div className="flame" style={{ animationDelay: `${delay}s` }}>
      <div className="flame-inner"></div>
    </div>
  )

  return (
    <div className="menorah-container">
      <svg className="menorah-svg" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C0C0C0" />
            <stop offset="15%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E0E0E0" />
            <stop offset="50%" stopColor="#A9A9A9" />
            <stop offset="65%" stopColor="#D3D3D3" />
            <stop offset="85%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>
          
          <linearGradient id="silverStem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A0A0A0" />
            <stop offset="30%" stopColor="#F0F0F0" />
            <stop offset="50%" stopColor="#C0C0C0" />
            <stop offset="70%" stopColor="#DCDCDC" />
            <stop offset="100%" stopColor="#909090" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- BASE --- */}
        {/* Decorative feet */}
        <path d="M140 310 Q130 315 125 310 Q120 300 135 295 L265 295 Q280 300 275 310 Q270 315 260 310" 
              fill="url(#silverGradient)" stroke="#888" strokeWidth="0.5" />
        
        {/* Main Base structure */}
        <path d="M150 295 C150 280, 190 260, 200 240 C210 260, 250 280, 250 295 Z" 
              fill="url(#silverGradient)" stroke="#999" strokeWidth="0.5" />
        
        {/* Central Stem Column */}
        <rect x="194" y="160" width="12" height="80" rx="2" fill="url(#silverStem)" />
        {/* Decorative nodes on stem */}
        <ellipse cx="200" cy="200" rx="10" ry="6" fill="url(#silverGradient)" stroke="#888" strokeWidth="0.5" />
        <ellipse cx="200" cy="170" rx="9" ry="5" fill="url(#silverGradient)" stroke="#888" strokeWidth="0.5" />

        {/* --- BRANCHES (Curved) --- */}
        {/* We use cubic bezier curves for elegant S-shapes */}
        
        {/* Right Side Branches (1, 2, 3, 4) */}
        {/* Inner Right (4) */}
        <path d="M200 180 C200 180, 220 180, 230 160" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Mid Right (3) */}
        <path d="M200 190 C200 190, 235 190, 250 155" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Far Right (2) */}
        <path d="M200 200 C200 200, 250 200, 270 150" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Outer Right (1) */}
        <path d="M200 210 C200 210, 265 210, 290 145" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />


        {/* Left Side Branches (8, 7, 6, 5) */}
        {/* Inner Left (5) */}
        <path d="M200 180 C200 180, 180 180, 170 160" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Mid Left (6) */}
        <path d="M200 190 C200 190, 165 190, 150 155" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Far Left (7) */}
        <path d="M200 200 C200 200, 150 200, 130 150" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Outer Left (8) */}
        <path d="M200 210 C200 210, 135 210, 110 145" 
              fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />


        {/* --- CANDLE CUPS --- */}
        {/* Shamash Cup (Center) */}
        <g>
          <path d="M192 145 L208 145 L206 160 L194 160 Z" fill="url(#silverGradient)" />
          <ellipse cx="200" cy="145" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>

        {/* Right Cups */}
        <g transform="translate(290, 145)"> {/* 1 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>
        <g transform="translate(270, 150)"> {/* 2 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>
        <g transform="translate(250, 155)"> {/* 3 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>
        <g transform="translate(230, 160)"> {/* 4 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>

        {/* Left Cups */}
        <g transform="translate(170, 160)"> {/* 5 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>
        <g transform="translate(150, 155)"> {/* 6 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>
        <g transform="translate(130, 150)"> {/* 7 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>
        <g transform="translate(110, 145)"> {/* 8 */}
          <path d="M-8 0 L8 0 L6 12 L-6 12 Z" fill="url(#silverGradient)" />
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="#DCDCDC" stroke="#999" strokeWidth="0.5" />
        </g>

        {/* --- CANDLES (White wax) --- */}
        {/* Shamash */}
        <rect x="196" y="120" width="8" height="25" fill="#FDFDFD" />
        
        {/* Right Candles */}
        {/* 1 */}<rect x="286" y="120" width="8" height="25" fill="#FDFDFD" />
        {/* 2 */}<rect x="266" y="125" width="8" height="25" fill="#FDFDFD" />
        {/* 3 */}<rect x="246" y="130" width="8" height="25" fill="#FDFDFD" />
        {/* 4 */}<rect x="226" y="135" width="8" height="25" fill="#FDFDFD" />

        {/* Left Candles */}
        {/* 5 */}<rect x="166" y="135" width="8" height="25" fill="#FDFDFD" />
        {/* 6 */}<rect x="146" y="130" width="8" height="25" fill="#FDFDFD" />
        {/* 7 */}<rect x="126" y="125" width="8" height="25" fill="#FDFDFD" />
        {/* 8 */}<rect x="106" y="120" width="8" height="25" fill="#FDFDFD" />

      </svg>

      {/* --- FLAMES OVERLAY --- */}
      <div className="flames-overlay">
        {/* Shamash (Center) - Always lit */}
        <div className="flame-position" style={{ left: '50%', top: '28%' }}>
          <Flame delay={0} />
        </div>

        {/* Right Side (1-4) */}
        {currentDay >= 1 && (
        <div className="flame-position" style={{ left: '72.5%', top: '28%' }}> {/* Pos 1 */}
          <Flame delay={0.1} />
        </div>
        )}
        {currentDay >= 2 && (
        <div className="flame-position" style={{ left: '67.5%', top: '29.5%' }}> {/* Pos 2 */}
          <Flame delay={0.2} />
        </div>
        )}
        {currentDay >= 3 && (
        <div className="flame-position" style={{ left: '62.5%', top: '31%' }}> {/* Pos 3 */}
          <Flame delay={0.3} />
        </div>
        )}
        {currentDay >= 4 && (
        <div className="flame-position" style={{ left: '57.5%', top: '32.5%' }}> {/* Pos 4 */}
          <Flame delay={0.4} />
        </div>
        )}

        {/* Left Side (5-8) */}
        {currentDay >= 5 && (
        <div className="flame-position" style={{ left: '42.5%', top: '32.5%' }}> {/* Pos 5 */}
          <Flame delay={0.5} />
        </div>
        )}
        {currentDay >= 6 && (
        <div className="flame-position" style={{ left: '37.5%', top: '31%' }}> {/* Pos 6 */}
          <Flame delay={0.6} />
        </div>
        )}
        {currentDay >= 7 && (
        <div className="flame-position" style={{ left: '32.5%', top: '29.5%' }}> {/* Pos 7 */}
          <Flame delay={0.7} />
        </div>
        )}
        {currentDay >= 8 && (
        <div className="flame-position" style={{ left: '27.5%', top: '28%' }}> {/* Pos 8 */}
          <Flame delay={0.8} />
        </div>
        )}
      </div>

      <div className="chanukah-day-label">
        <span className="day-text">נר {currentDay} של חנוכה</span>
      </div>
    </div>
  )
}
