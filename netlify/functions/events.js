// Netlify Function for managing events
import { getStore } from '@netlify/blobs'

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
      const store = getStore('chazonyosef')
      const events = await store.get('events', { type: 'json' }) || []

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(events)
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
      
      // Save to Netlify Blobs
      const store = getStore('chazonyosef')
      await store.setJSON('events', data)
      
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
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
