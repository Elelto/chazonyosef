// Netlify Function for managing popup settings with Firebase
import { getFirestore, verifyAuth } from './firebase-admin.js'

export const handler = async (event, context) => {
  console.log('🔵 Firebase Popup Function Called:', {
    method: event.httpMethod,
    path: event.path
  })

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const db = getFirestore()

    // GET - Public access
    if (event.httpMethod === 'GET') {
      console.log('📖 GET request - fetching popup settings from Firebase')
      
      const docRef = db.collection('settings').doc('popup')
      const doc = await docRef.get()
      
      if (doc.exists) {
        console.log('✅ Popup settings fetched from Firebase')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ popup: doc.data().popup })
        }
      } else {
        console.log('📝 No popup settings found, returning default')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ popup: null })
        }
      }
    }

    // POST/PUT - Protected, requires authentication
    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      console.log('💾 Write request received')
      
      // Verify authentication
      const { authenticated, user } = verifyAuth(context)
      if (!authenticated) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized - Authentication required' })
        }
      }

      const data = JSON.parse(event.body)
      console.log('📝 Saving popup settings for user:', user.email)
      
      const docRef = db.collection('settings').doc('popup')
      await docRef.set(data)
      
      console.log('✅ Popup settings saved successfully to Firebase')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Popup settings updated successfully',
          data 
        })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('❌ ERROR in firebase-popup function:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    }
  }
}
