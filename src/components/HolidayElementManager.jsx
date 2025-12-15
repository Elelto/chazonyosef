import { useState, useEffect } from 'react'
import { getCurrentHoliday } from '../utils/holidayThemes'
import ChanukahMenorah from './ChanukahMenorah'
import RoshHashanahElement from './holidays/RoshHashanahElement'
import YomKippurElement from './holidays/YomKippurElement'
import SukkotElement from './holidays/SukkotElement'
import PurimElement from './holidays/PurimElement'
import PesachElement from './holidays/PesachElement'
import ShavuotElement from './holidays/ShavuotElement'

export default function HolidayElementManager() {
  const [activeHoliday, setActiveHoliday] = useState(null)

  useEffect(() => {
    const holiday = getCurrentHoliday()
    if (holiday && holiday.showElement) {
      setActiveHoliday(holiday)
    }
  }, [])

  if (!activeHoliday) return null

  switch (activeHoliday.id) {
    case 'chanukah':
      // The Menorah component handles its own internal logic for days, 
      // but we only render it if the manager says it's Chanukah time (including advance notice)
      return <ChanukahMenorah holidayData={activeHoliday} />
    
    /* 
       TODO: Re-enable these holiday elements after implementing proper animations.
       See 'Holiday Animations' memory for details.
    
    case 'rosh_hashanah':
      return <RoshHashanahElement holidayData={activeHoliday} />
      
    case 'yom_kippur':
      return <YomKippurElement holidayData={activeHoliday} />
      
    case 'sukkot':
      return <SukkotElement holidayData={activeHoliday} />
      
    case 'purim':
      return <PurimElement holidayData={activeHoliday} />
      
    case 'pesach':
      return <PesachElement holidayData={activeHoliday} />
      
    case 'shavuot':
      return <ShavuotElement holidayData={activeHoliday} />
    */
      
    default:
      return null
  }
}
