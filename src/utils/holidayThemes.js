import { hebrewDateToGregorian } from './hebrewCalendar'

export const JEWISH_HOLIDAYS = {
  ROSH_HASHANAH: {
    id: 'rosh_hashanah',
    name: 'ראש השנה',
    hebrewMonth: 7, // Tishrei
    hebrewDay: 1,
    duration: 2,
    advanceNoticeDays: 7,
    theme: {
      primary: '#D4AF37',
      secondary: '#8B4513',
      description: 'שנה טובה ומתוקה'
    }
  },
  YOM_KIPPUR: {
    id: 'yom_kippur',
    name: 'יום כיפור',
    hebrewMonth: 7, // Tishrei
    hebrewDay: 10,
    duration: 1,
    advanceNoticeDays: 7,
    theme: {
      primary: '#FFFFFF',
      secondary: '#E8E8E8',
      description: 'גמר חתימה טובה'
    }
  },
  SUKKOT: {
    id: 'sukkot',
    name: 'סוכות',
    hebrewMonth: 7, // Tishrei
    hebrewDay: 15,
    duration: 7,
    advanceNoticeDays: 7,
    theme: {
      primary: '#228B22',
      secondary: '#8FBC8F',
      description: 'חג סוכות שמח'
    }
  },
  CHANUKAH: {
    id: 'chanukah',
    name: 'חנוכה',
    hebrewMonth: 9, // Kislev
    hebrewDay: 25,
    duration: 8,
    advanceNoticeDays: 7,
    theme: {
      primary: '#0047AB',
      secondary: '#C0C0C0',
      description: 'חנוכה שמח'
    }
  },
  PURIM: {
    id: 'purim',
    name: 'פורים',
    hebrewMonth: 12, // Adar
    hebrewDay: 14,
    duration: 1,
    advanceNoticeDays: 7,
    theme: {
      primary: '#800080',
      secondary: '#FFD700',
      description: 'פורים שמח'
    }
  },
  PESACH: {
    id: 'pesach',
    name: 'פסח',
    hebrewMonth: 1, // Nisan
    hebrewDay: 15,
    duration: 7,
    advanceNoticeDays: 7,
    theme: {
      primary: '#4169E1',
      secondary: '#87CEEB',
      description: 'חג פסח כשר ושמח'
    }
  },
  SHAVUOT: {
    id: 'shavuot',
    name: 'שבועות',
    hebrewMonth: 3, // Sivan
    hebrewDay: 6,
    duration: 1,
    advanceNoticeDays: 7,
    theme: {
      primary: '#32CD32',
      secondary: '#FFFFFF',
      description: 'חג שבועות שמח'
    }
  }
}

export function getCurrentHoliday() {
  const now = new Date()
  
  for (const holiday of Object.values(JEWISH_HOLIDAYS)) {
    const holidayDate = hebrewDateToGregorian(
      now.getFullYear(),
      holiday.hebrewMonth,
      holiday.hebrewDay
    )
    
    if (!holidayDate) continue
    
    // Calculate start of advance notice period
    const advanceDate = new Date(holidayDate)
    advanceDate.setDate(advanceDate.getDate() - holiday.advanceNoticeDays)
    
    // Calculate end of holiday
    const endDate = new Date(holidayDate)
    endDate.setDate(endDate.getDate() + holiday.duration)
    
    // Check if today is within the range [advanceDate, endDate]
    if (now >= advanceDate && now <= endDate) {
      const daysUntil = Math.ceil((holidayDate - now) / (1000 * 60 * 60 * 24))
      return {
        ...holiday,
        holidayDate,
        daysUntil: daysUntil > 0 ? daysUntil : 0,
        isActive: now >= holidayDate && now <= endDate, // Actually in the holiday
        isUpcoming: now < holidayDate, // In advance notice period
        showElement: true // Flag to show the element
      }
    }
  }
  
  return null
}
