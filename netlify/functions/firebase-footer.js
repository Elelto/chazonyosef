// Netlify Function for managing footer content with Firebase
import { getFirestore, verifyAuth } from './firebase-admin.js'

export const handler = async (event, context) => {
  console.log('🔵 Firebase Footer Function Called:', {
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
      console.log('📖 GET request - fetching footer content from Firebase')
      
      const docRef = db.collection('settings').doc('footer')
      const doc = await docRef.get()
      
      if (doc.exists) {
        console.log('✅ Footer content fetched from Firebase')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(doc.data())
        }
      } else {
        console.log('📝 No footer content found, returning default')
        const defaultContent = {
          content: {
            about: {
              title: 'בית המדרש "חזון יוסף"',
              description: 'בית מדרש לתורה ותפילה המשרת את קהילת שיכון ג\' והסביבה בבני ברק. מזמינים אתכם להצטרף לשיעורים ולתפילות.'
            },
            contact: {
              address: 'בעל התניא 26',
              city: 'בני ברק',
              phone: '***-***-****',
              email: '***@***.com'
            },
            prayerTimes: {
              title: 'זמני תפילה',
              shacharit: '6:30, 7:30',
              mincha: '13:30',
              arvit: '20:00',
              linkText: 'לזמנים מלאים →'
            },
            copyright: {
              text: 'בית המדרש "חזון יוסף". כל הזכויות שמורות.',
              subtext: 'פותח באהבה עבור קהילת שיכון ג\' והסביבה'
            }
          }
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(defaultContent)
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
      console.log('📝 Saving footer content for user:', user.email)
      
      const docRef = db.collection('settings').doc('footer')
      await docRef.set(data)
      
      console.log('✅ Footer content saved successfully to Firebase')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Footer content updated successfully',
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
    console.error('❌ ERROR in firebase-footer function:', error)
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
