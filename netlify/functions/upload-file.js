// Netlify Function for uploading files to Firebase Storage
import { getStorage, verifyAuth } from './firebase-admin.js'

export const handler = async (event, context) => {
  console.log('📤 Upload File Function Called:', {
    method: event.httpMethod,
    path: event.path
  })

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Verify authentication
    const { authenticated, user } = verifyAuth(context)
    if (!authenticated) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - Authentication required' })
      }
    }

    console.log('📝 Upload request from user:', user.email)

    // Parse request body
    const { fileData, fileName, contentType } = JSON.parse(event.body)

    if (!fileData || !fileName || !contentType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: fileData, fileName, contentType' })
      }
    }

    // Validate file type (images only)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
    
    if (!allowedTypes.includes(contentType)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Only image files (JPG, PNG, GIF, WebP) are allowed' })
      }
    }

    // Convert base64 to buffer
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (buffer.length > maxSize) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'File too large (max 5MB)' })
      }
    }

    console.log('📦 File details:', {
      fileName,
      contentType,
      size: buffer.length,
      sizeKB: Math.round(buffer.length / 1024)
    })

    // Get Storage bucket
    const storage = getStorage()
    const bucket = storage.bucket()

    // Create unique file name with timestamp
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `popups/${timestamp}_${sanitizedFileName}`

    console.log('☁️ Uploading to Storage:', storagePath)

    // Upload file to Storage
    const file = bucket.file(storagePath)
    await file.save(buffer, {
      metadata: {
        contentType: contentType,
        metadata: {
          uploadedBy: user.email,
          uploadedAt: new Date().toISOString()
        }
      }
    })

    // Make file publicly readable
    await file.makePublic()

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

    console.log('✅ File uploaded successfully:', publicUrl)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url: publicUrl,
        fileName: sanitizedFileName,
        size: buffer.length
      })
    }
  } catch (error) {
    console.error('❌ ERROR in upload-file function:', error)
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
