// API utility functions for authenticated requests to Netlify Functions

/**
 * Get the current user's authentication token
 */
export const getAuthToken = () => {
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
  
  return authenticatedFetch(`/.netlify/functions/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
