// Netlify Function for managing prayer times
import { getStore } from '@netlify/blobs'

const defaultPrayerTimes = {
  weekday: {
    shacharit: ['6:30', '7:30', '8:15'],
    mincha: ['13:30', '14:15'],
    arvit: ['20:00', '21:00']
  },
  shabbat: {
    friday: {
      mincha: '18:30',
      candleLighting: '19:15'
    },
    saturday: {
      shacharit: '8:30',
      mincha: '19:00',
      arvit: '20:15',
      shabbatEnds: '20:25'
    }
  },
  special: [
    { title: 'שיעור דף יומי', time: '6:00', days: 'כל יום' },
    { title: 'שיעור הלכה', time: '20:30', days: 'א׳, ג׳, ה׳' },
    { title: 'שיעור גמרא', time: '21:00', days: 'ב׳, ד׳' }
  ]
}

export const handler = async (event, context) => {
  console.log('🔵 Prayer Times Function Called:', {
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body,
    hasContext: !!context,
    hasClientContext: !!context?.clientContext
  })

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ OPTIONS request handled')
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // Check if user is authenticated
    const user = context?.clientContext?.user || null
    console.log('👤 User authenticated:', {
      hasUser: !!user,
      email: user?.email,
      hasClientContext: !!context?.clientContext,
      authHeader: event.headers?.authorization ? 'Present' : 'Missing'
    })
    
    if (event.httpMethod === 'GET') {
      console.log('📖 GET request - fetching prayer times')
      const store = getStore('chazonyosef')
      const savedData = await store.get('prayer-times', { type: 'json' })
      const prayerTimes = savedData || defaultPrayerTimes
      console.log('✅ Prayer times fetched:', savedData ? '(from store)' : '(default)')

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(prayerTimes)
      }
    }

    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      console.log('💾 Write request received')
      
      // Protected endpoint - only authenticated users can write
      if (!user) {
        console.log('❌ Unauthorized - no user found')
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const data = JSON.parse(event.body)
      console.log('📝 Data to save:', data)
      
      // Save to Netlify Blobs
      const store = getStore('chazonyosef')
      await store.setJSON('prayer-times', data)
      console.log('✅ Prayer times saved successfully to Netlify Blobs')
      
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
    console.error('❌ ERROR in prayer-times function:', {
      message: error.message,
      stack: error.stack
    })
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
