// Netlify Function for managing prayer times with Firebase
import { getFirestore, verifyAuth } from './firebase-admin.js'

const defaultPrayerTimes = {
  weekday: {
    shacharit: ['06:30', '07:30', '08:15'],
    mincha: ['13:30', '14:15'],
    arvit: ['20:00', '21:00']
  },
  shabbat: {
    friday: {
      mincha: '18:30',
      candleLighting: '19:15'
    },
    saturday: {
      shacharit: '08:30',
      mincha: '19:00',
      arvit: '20:15',
      shabbatEnds: '20:25'
    }
  }
}

export const handler = async (event, context) => {
  console.log('🔵 Firebase Prayer Times Function Called:', {
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
      console.log('📖 GET request - fetching prayer times from Firebase')
      
      const docRef = db.collection('settings').doc('prayerTimes')
      const doc = await docRef.get()
      
      if (doc.exists) {
        console.log('✅ Prayer times fetched from Firebase')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(doc.data())
        }
      } else {
        console.log('📝 No data found, returning defaults')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(defaultPrayerTimes)
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
      console.log('📝 Saving prayer times for user:', user.email)
      
      const docRef = db.collection('settings').doc('prayerTimes')
      await docRef.set(data)
      
      console.log('✅ Prayer times saved successfully to Firebase')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Prayer times updated successfully',
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
    console.error('❌ ERROR in firebase-prayer-times function:', error)
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
