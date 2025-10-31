// Netlify Function for managing events
import { getStore } from '@netlify/blobs'

export const handler = async (event, context) => {
  console.log('🔵 Events Function Called:', {
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body,
    bodyLength: event.body?.length
  })

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ OPTIONS request handled')
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const user = context?.clientContext?.user || null
    console.log('👤 User authenticated:', {
      hasUser: !!user,
      email: user?.email,
      hasClientContext: !!context?.clientContext,
      authHeader: event.headers?.authorization ? 'Present' : 'Missing'
    })
    
    if (event.httpMethod === 'GET') {
      console.log('📖 GET request - fetching events')
      const store = getStore('chazonyosef')
      const events = await store.get('events', { type: 'json' }) || []
      console.log('✅ Events fetched:', events.length, 'items')

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(events)
      }
    }

    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT' || event.httpMethod === 'DELETE') {
      console.log('💾 Write request received')
      
      if (!user) {
        console.log('❌ Unauthorized - no user found')
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const data = event.body ? JSON.parse(event.body) : null
      console.log('📝 Data to save:', { itemCount: Array.isArray(data) ? data.length : 'not array', data })
      
      // Save to Netlify Blobs
      const store = getStore('chazonyosef')
      await store.setJSON('events', data)
      console.log('✅ Events saved successfully to Netlify Blobs')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Events updated successfully',
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
    console.error('❌ ERROR in events function:', {
      message: error.message,
      stack: error.stack,
      name: error.name
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
