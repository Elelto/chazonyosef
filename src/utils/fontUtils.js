export const AVAILABLE_FONTS = [
  {
    name: 'Assistant',
    value: 'Assistant, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Assistant:wght@300;400;500;600;700;800'
  },
  {
    name: 'Rubik',
    value: 'Rubik, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Rubik:wght@300;400;500;600;700;800;900'
  },
  {
    name: 'Heebo',
    value: 'Heebo, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Heebo:wght@100;200;300;400;500;600;700;800;900'
  },
  {
    name: 'Varela Round',
    value: 'Varela Round, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Varela+Round'
  },
  {
    name: 'Alef',
    value: 'Alef, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Alef:wght@400;700'
  },
  {
    name: 'Open Sans',
    value: 'Open Sans, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Open+Sans:wght@300;400;500;600;700;800'
  },
  {
    name: 'Secular One',
    value: 'Secular One, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Secular+One'
  },
  {
    name: 'Arimo',
    value: 'Arimo, sans-serif',
    category: 'sans-serif',
    hebrewSupport: true,
    googleFont: 'Arimo:wght@400;500;600;700'
  },
  {
    name: 'Frank Ruhl Libre',
    value: 'Frank Ruhl Libre, serif',
    category: 'serif',
    hebrewSupport: true,
    googleFont: 'Frank+Ruhl+Libre:wght@300;400;500;700;900'
  },
  {
    name: 'Tinos',
    value: 'Tinos, serif',
    category: 'serif',
    hebrewSupport: true,
    googleFont: 'Tinos:wght@400;700'
  }
]

export const applyFontToCSS = (fontValue) => {
  console.log('🔤 Applying font:', fontValue)
  document.documentElement.style.setProperty('--font-family', fontValue)
}

export const loadGoogleFont = (googleFontParam) => {
  const existingLink = document.getElementById('google-font-link')
  
  if (existingLink) {
    existingLink.remove()
  }

  const link = document.createElement('link')
  link.id = 'google-font-link'
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${googleFontParam}&display=swap`
  document.head.appendChild(link)
  
  console.log('🔤 Loaded Google Font:', googleFontParam)
}

export const applyFont = (fontName) => {
  const font = AVAILABLE_FONTS.find(f => f.name === fontName)
  
  if (!font) {
    console.error('Font not found:', fontName)
    return
  }

  loadGoogleFont(font.googleFont)
  
  setTimeout(() => {
    applyFontToCSS(font.value)
  }, 100)
}
