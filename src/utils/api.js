// API utility functions for authenticated requests to Netlify Functions

/**
 * Get the current user's authentication token
 */
export const getAuthToken = () => {
  // Development mode bypass
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  if (isDevelopment) {
    console.log('🔧 Dev mode: Using mock token')
    return 'dev-mode-token'
  }
  
  const user = window.netlifyIdentity?.currentUser()
  if (!user || !user.token) {
    console.warn('⚠️ No authenticated user or token found')
    return null
  }
  return user.token.access_token
}

/**
 * Make an authenticated API request to Netlify Functions
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('Authentication required - please log in')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  }

  console.log('🔐 Making authenticated request:', {
    url,
    method: options.method || 'GET',
    hasToken: !!token
  })

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('❌ API request failed:', {
      status: response.status,
      error
    })
    
    // Provide helpful error messages
    let errorMessage = error.error || `Request failed with status ${response.status}`
    
    if (response.status === 401) {
      errorMessage = 'לא מחובר - אנא התחבר מחדש'
    } else if (response.status === 503) {
      errorMessage = 'שגיאת הגדרות Firebase - צור קשר עם המנהל'
    } else if (error.hint) {
      errorMessage += `\n${error.hint}`
    }
    
    throw new Error(errorMessage)
  }

  return response.json()
}

/**
 * Fetch data from Firebase via Netlify Function (public access)
 */
export const fetchFromFirebase = async (endpoint) => {
  console.log('📥 Fetching from Firebase:', endpoint)
  
  // Development mode: fetch from localStorage
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  if (isDevelopment) {
    console.log('🔧 Dev mode: Fetching from localStorage instead of Firebase')
    
    // Map endpoint to localStorage key
    const storageKey = endpoint.replace('firebase-', '')
    let data = null
    
    if (endpoint === 'firebase-settings') {
      const settings = localStorage.getItem('siteSettings')
      if (settings) {
        try {
          data = { settings: JSON.parse(settings) }
        } catch (e) {
          console.error('Error parsing settings from localStorage', e)
        }
      }
    } else {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          data = JSON.parse(stored)
        } catch (e) {
          console.error(`Error parsing ${storageKey} from localStorage`, e)
        }
      }
    }
    
    if (data) {
        console.log('✅ Loaded from localStorage:', data)
        return Promise.resolve(data)
    }
    console.log('⚠️ Dev mode: No data found in localStorage for', endpoint)
    // If no data in localStorage, we can try to fetch (which might fail) or return empty
    // Letting it fall through to fetch allows 'netlify dev' to work if running
  }
  
  const response = await fetch(`/.netlify/functions/${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('❌ Fetch failed:', error)
    throw new Error(error.error || 'Failed to fetch data')
  }

  return response.json()
}

/**
 * Save data to Firebase via Netlify Function (requires authentication)
 */
export const saveToFirebase = async (endpoint, data) => {
  console.log('💾 Saving to Firebase:', endpoint, data)
  
  // Development mode: save to localStorage
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  if (isDevelopment) {
    console.log('🔧 Dev mode: Saving to localStorage instead of Firebase')
    
    // Map endpoint to localStorage key
    const storageKey = endpoint.replace('firebase-', '')
    
    if (endpoint === 'firebase-settings') {
      localStorage.setItem('siteSettings', JSON.stringify(data.settings))
    } else {
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
    
    return Promise.resolve({ success: true, message: 'Saved to localStorage' })
  }
  
  return authenticatedFetch(`/.netlify/functions/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
