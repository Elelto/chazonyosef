// Netlify Function for managing contact page content with Firebase
import { getFirestore, verifyAuth } from './firebase-admin.js'

export const handler = async (event, context) => {
  console.log('🔵 Firebase Contact Page Function Called:', {
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
      console.log('📖 GET request - fetching contact page content from Firebase')
      
      const docRef = db.collection('settings').doc('contactPage')
      const doc = await docRef.get()
      
      if (doc.exists) {
        console.log('✅ Contact page content fetched from Firebase')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(doc.data())
        }
      } else {
        console.log('📝 No contact page content found, returning default')
        const defaultContent = {
          content: {
            header: {
              title: 'צור קשר',
              subtitle: 'נשמח לשמוע ממך! צור איתנו קשר בכל שאלה, הצעה או בקשה'
            },
            contactInfo: {
              title: 'פרטי התקשרות',
              address: {
                street: 'בעל התניא 26',
                city: 'בני ברק',
                country: 'ישראל',
                mapLink: 'https://www.google.com/maps/search/?api=1&query=בעל+התניא+26+בני+ברק',
                mapLinkText: 'פתח ב-Google Maps →'
              },
              phone: {
                number: '***-***-****',
                display: '***-***-****'
              },
              email: {
                address: '***@***.com',
                display: '***@***.com'
              },
              hours: {
                weekdays: 'ימי חול: 6:00 - 22:00',
                shabbat: 'שבת: לפי זמני התפילות'
              }
            },
            form: {
              title: 'שלח לנו הודעה',
              nameLabel: 'שם מלא',
              namePlaceholder: 'הכנס את שמך המלא',
              emailLabel: 'כתובת אימייל',
              emailPlaceholder: 'example@email.com',
              phoneLabel: 'מספר טלפון',
              phonePlaceholder: '050-1234567',
              messageLabel: 'הודעה',
              messagePlaceholder: 'כתוב את הודעתך כאן...',
              submitButton: 'שלח הודעה',
              submittingButton: 'שולח...',
              successMessage: 'ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.',
              errorMessage: 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.'
            },
            map: {
              title: 'מיקום',
              placeholder: 'מפה תתווסף בקרוב'
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
      console.log('📝 Saving contact page content for user:', user.email)
      
      const docRef = db.collection('settings').doc('contactPage')
      await docRef.set(data)
      
      console.log('✅ Contact page content saved successfully to Firebase')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Contact page content updated successfully',
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
    console.error('❌ ERROR in firebase-contact-page function:', error)
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
