// Netlify Function for managing announcements
import { getStore } from '@netlify/blobs'

exports.handler = async (event, context) => {
  console.log('🔵 Announcements Function Called:', {
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body
  })

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ OPTIONS request handled')
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const { user } = context.clientContext || {}
    console.log('👤 User authenticated:', !!user)
    
    if (event.httpMethod === 'GET') {
      console.log('📖 GET request - fetching announcements')
      const store = getStore('chazonyosef')
      const announcements = await store.get('announcements', { type: 'json' }) || []
      console.log('✅ Announcements fetched:', announcements.length, 'items')

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(announcements)
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
      console.log('📝 Data to save:', { itemCount: Array.isArray(data) ? data.length : 'not array' })
      
      // Save to Netlify Blobs
      const store = getStore('chazonyosef')
      await store.setJSON('announcements', data)
      console.log('✅ Announcements saved successfully to Netlify Blobs')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Announcements updated successfully',
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
    console.error('❌ ERROR in announcements function:', {
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
