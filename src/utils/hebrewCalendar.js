import { HDate } from '@hebcal/core'

export function hebrewDateToGregorian(gregorianYear, hebrewMonth, hebrewDay) {
  try {
    const currentHebrewYear = new HDate(new Date(gregorianYear, 6, 1)).getFullYear()
    
    const candidates = []
    
    for (let yearOffset = -1; yearOffset <= 1; yearOffset++) {
      const hebrewYear = currentHebrewYear + yearOffset
      
      try {
        const hdate = new HDate(hebrewDay, hebrewMonth, hebrewYear)
        const gregorianDate = hdate.greg()
        
        candidates.push({
          date: gregorianDate,
          yearDiff: Math.abs(gregorianDate.getFullYear() - gregorianYear)
        })
      } catch (e) {
        continue
      }
    }
    
    if (candidates.length === 0) return null
    
    candidates.sort((a, b) => {
      if (a.yearDiff !== b.yearDiff) {
        return a.yearDiff - b.yearDiff
      }
      return Math.abs(a.date.getFullYear() - gregorianYear) - Math.abs(b.date.getFullYear() - gregorianYear)
    })
    
    const best = candidates.find(c => c.date.getFullYear() === gregorianYear)
    return best ? best.date : candidates[0].date
    
  } catch (error) {
    console.error('Error converting Hebrew date:', error)
    return null
  }
}

export function getCurrentChanukahDay() {
  const today = new Date()
  const hdate = new HDate(today)
  const year = hdate.getFullYear()
  
  // Chanukah starts 25 Kislev
  const chanukahStart = new HDate(25, 'Kislev', year)
  
  // HDate subtraction gives difference in days
  const diff = hdate.abs() - chanukahStart.abs()
  
  if (diff >= 0 && diff < 8) {
    return diff + 1
  }
  
  return 0
}
