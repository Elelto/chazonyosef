/**
 * Color utility functions for color management system
 */

/**
 * Convert HEX color to RGB
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to HEX
 */
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * Calculate relative luminance for contrast ratio
 */
const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1, color2) => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export const checkAccessibility = (foreground, background) => {
  const ratio = getContrastRatio(foreground, background)
  
  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
    AALarge: ratio >= 3,
    AAALarge: ratio >= 4.5
  }
}

/**
 * Generate color shades from base color (50-900 like Tailwind)
 */
export const generateShades = (baseColor) => {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return {}
  
  const shades = {}
  
  // Generate lighter shades (50-400)
  const lighterSteps = [
    { key: '50', mix: 0.95 },
    { key: '100', mix: 0.9 },
    { key: '200', mix: 0.75 },
    { key: '300', mix: 0.6 },
    { key: '400', mix: 0.3 }
  ]
  
  lighterSteps.forEach(({ key, mix }) => {
    const r = Math.round(rgb.r + (255 - rgb.r) * mix)
    const g = Math.round(rgb.g + (255 - rgb.g) * mix)
    const b = Math.round(rgb.b + (255 - rgb.b) * mix)
    shades[key] = rgbToHex(r, g, b)
  })
  
  // Base color (500)
  shades['500'] = baseColor
  
  // Generate darker shades (600-900)
  const darkerSteps = [
    { key: '600', mix: 0.2 },
    { key: '700', mix: 0.4 },
    { key: '800', mix: 0.6 },
    { key: '900', mix: 0.8 }
  ]
  
  darkerSteps.forEach(({ key, mix }) => {
    const r = Math.round(rgb.r * (1 - mix))
    const g = Math.round(rgb.g * (1 - mix))
    const b = Math.round(rgb.b * (1 - mix))
    shades[key] = rgbToHex(r, g, b)
  })
  
  return shades
}

/**
 * Predefined color presets
 */
export const colorPresets = {
  blue: {
    name: 'כחול קלאסי',
    primary: '#3b82f6',
    secondary: '#0ea5e9',
    accent: '#06b6d4'
  },
  purple: {
    name: 'סגול מלכותי',
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#d946ef'
  },
  green: {
    name: 'ירוק טבעי',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#14b8a6'
  },
  orange: {
    name: 'כתום חם',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c'
  },
  teal: {
    name: 'טורקיז מרגיע',
    primary: '#14b8a6',
    secondary: '#0d9488',
    accent: '#06b6d4'
  },
  indigo: {
    name: 'אינדיגו עמוק',
    primary: '#4f46e5',
    secondary: '#6366f1',
    accent: '#818cf8'
  },
  rose: {
    name: 'ורוד עדין',
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fb7185'
  },
  amber: {
    name: 'ענבר זהוב',
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fbbf24'
  }
}

/**
 * Common colors palette
 */
export const commonColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#78716c'
]

/**
 * Convert HEX to RGB string for CSS variables
 */
const hexToRgbString = (hex) => {
  const rgb = hexToRgb(hex)
  return rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '0 0 0'
}

/**
 * Apply colors to CSS variables
 */
export const applyColorsToCSS = (colors) => {
  const root = document.documentElement
  
  // Apply primary color and its shades
  if (colors.primary) {
    const primaryShades = generateShades(colors.primary)
    Object.entries(primaryShades).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, hexToRgbString(color))
    })
    root.style.setProperty('--color-primary', hexToRgbString(colors.primary))
  }
  
  // Apply secondary color and its shades
  if (colors.secondary) {
    const secondaryShades = generateShades(colors.secondary)
    Object.entries(secondaryShades).forEach(([shade, color]) => {
      root.style.setProperty(`--color-secondary-${shade}`, hexToRgbString(color))
    })
    root.style.setProperty('--color-secondary', hexToRgbString(colors.secondary))
  }
  
  // Apply accent color and its shades
  if (colors.accent) {
    const accentShades = generateShades(colors.accent)
    Object.entries(accentShades).forEach(([shade, color]) => {
      root.style.setProperty(`--color-accent-${shade}`, hexToRgbString(color))
    })
    root.style.setProperty('--color-accent', hexToRgbString(colors.accent))
  }
}
