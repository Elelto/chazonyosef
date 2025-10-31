// Netlify Function for managing gallery images
import { getStore } from '@netlify/blobs'

const defaultImages = [
  {
    id: 1,
    url: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=בית+המדרש',
    title: 'בית המדרש מבפנים',
    description: 'מבט כללי על בית המדרש'
  },
  {
    id: 2,
    url: 'https://via.placeholder.com/400x300/eab308/ffffff?text=ארון+הקודש',
    title: 'ארון הקודש',
    description: 'ארון הקודש המפואר'
  }
]

exports.handler = async (event, context) => {
  console.log('🔵 Gallery Function Called:', {
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
      console.log('📖 GET request - fetching gallery')
      const store = getStore('chazonyosef')
      const savedData = await store.get('gallery', { type: 'json' })
      const images = savedData || defaultImages
      console.log('✅ Gallery fetched:', images.length, 'items', savedData ? '(from store)' : '(default)')

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(images)
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
      await store.setJSON('gallery', data)
      console.log('✅ Gallery saved successfully to Netlify Blobs')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Gallery updated successfully',
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
    console.error('❌ ERROR in gallery function:', {
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
