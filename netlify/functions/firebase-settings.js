// Netlify Function for managing site settings with Firebase
import { getFirestore, verifyAuth } from './firebase-admin.js'

export const handler = async (event, context) => {
  console.log('🔵 Firebase Settings Function Called:', {
    method: event.httpMethod,
    path: event.path
  })

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const db = getFirestore()

    // GET - Public access
    if (event.httpMethod === 'GET') {
      console.log('📖 GET request - fetching site settings from Firebase')
      
      const docRef = db.collection('settings').doc('siteSettings')
      const doc = await docRef.get()
      
      if (doc.exists) {
        console.log('✅ Site settings fetched from Firebase')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(doc.data())
        }
      } else {
        console.log('📝 No site settings found, returning default')
        const defaultSettings = {
          settings: {
            general: {
              siteName: 'בית המדרש "חזון יוסף"',
              siteDescription: 'בית מדרש לתורה ותפילה בשיכון ג\' והסביבה, בני ברק',
              logoUrl: '/logo.png'
            },
            seo: {
              metaTitle: 'בית המדרש חזון יוסף - שיכון ג\' בני ברק',
              metaDescription: 'בית מדרש לתורה ותפילה המשרת את קהילת שיכון ג\' והסביבה בבני ברק. שיעורי תורה, תפילות במניין ואירועים מיוחדים.',
              keywords: 'בית מדרש, חזון יוסף, בני ברק, שיכון ג, תפילות, שיעורי תורה'
            },
            colors: {
              primary: '#4f46e5',
              secondary: '#0d9488',
              accent: '#d97706'
            },
            social: {
              facebook: '',
              whatsapp: '',
              youtube: '',
              instagram: ''
            }
          }
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(defaultSettings)
        }
      }
    }

    // POST/PUT - Protected
    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      console.log('💾 Write request received')
      
      const { authenticated, user } = verifyAuth(context)
      if (!authenticated) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized - Authentication required' })
        }
      }

      const data = JSON.parse(event.body)
      console.log('📝 Saving site settings for user:', user.email)
      
      const docRef = db.collection('settings').doc('siteSettings')
      await docRef.set(data)
      
      console.log('✅ Site settings saved successfully to Firebase')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Site settings updated successfully',
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
    console.error('❌ ERROR in firebase-settings function:', error)
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
