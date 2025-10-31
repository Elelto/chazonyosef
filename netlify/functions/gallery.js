// Netlify Function for managing gallery images
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const { user } = context.clientContext || {}
    
    if (event.httpMethod === 'GET') {
      // Public endpoint
      const images = [
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(images)
      }
    }

    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT' || event.httpMethod === 'DELETE') {
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const data = event.body ? JSON.parse(event.body) : null
      
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
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
