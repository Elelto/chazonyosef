// Netlify Function for managing site content with Firebase
import { getFirestore, verifyAuth } from './firebase-admin.js'

export const handler = async (event, context) => {
  console.log('🔵 Firebase Site Content Function Called:', {
    method: event.httpMethod,
    path: event.path
  })

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const db = getFirestore()

    // GET - Public access
    if (event.httpMethod === 'GET') {
      console.log('📖 GET request - fetching site content from Firebase')
      
      const docRef = db.collection('settings').doc('siteContent')
      const doc = await docRef.get()
      
      if (doc.exists) {
        console.log('✅ Site content fetched from Firebase')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(doc.data())
        }
      } else {
        console.log('📝 No site content found, returning default')
        // Return default content structure
        const defaultContent = {
          content: {
            hero: {
              title: 'בית המדרש "חזון יוסף"',
              subtitle: 'שיכון ג\' והסביבה',
              address: 'בעל התניא 26, בני ברק'
            },
            about: {
              title: 'אודות בית המדרש',
              paragraph1: 'בית המדרש "חזון יוסף" משמש כמרכז רוחני לקהילת שיכון ג\' והסביבה בבני ברק. אנו מציעים תפילות במניינים קבועים, שיעורי תורה מגוונים, ואווירה חמה ומזמינה לכל המבקשים להתקרב לתורה ולעבודת ה\'.',
              paragraph2: 'בית המדרש נקרא על שם הרב יוסף זצ"ל, ומשמש כמקום מפגש לתלמידי חכמים, אברכים ובעלי בתים המבקשים לעסוק בתורה ובתפילה באווירה של קדושה ויראת שמים.'
            },
            features: {
              title: 'מה אנו מציעים',
              items: [
                {
                  id: 1,
                  title: 'תפילות במניין',
                  description: 'מניינים קבועים לשחרית, מנחה וערבית בזמנים נוחים לכל הציבור',
                  icon: 'clock'
                },
                {
                  id: 2,
                  title: 'שיעורי תורה',
                  description: 'שיעורים מגוונים בגמרא, הלכה, מוסר ומחשבה על ידי מגידי שיעורים מובילים',
                  icon: 'book'
                },
                {
                  id: 3,
                  title: 'קהילה חמה',
                  description: 'אווירה משפחתית ומזמינה, קהילה תומכת ומגובשת של אנשים יראי שמים',
                  icon: 'users'
                },
                {
                  id: 4,
                  title: 'אירועים מיוחדים',
                  description: 'סיומי מסכת, מסיבות מצווה, וערבי עיון מיוחדים לחגים ומועדים',
                  icon: 'heart'
                },
                {
                  id: 5,
                  title: 'מתקנים מודרניים',
                  description: 'בית מדרש מרווח ומאובזר, ספריית קודש עשירה, ומערכת הגברה איכותית',
                  icon: 'image'
                },
                {
                  id: 6,
                  title: 'עדכונים שוטפים',
                  description: 'הצטרפו לרשימת התפוצה שלנו לקבלת עדכונים על שיעורים, אירועים וזמני תפילה',
                  icon: 'mail'
                }
              ]
            },
            cta: {
              title: 'הצטרפו אלינו',
              description: 'אנו מזמינים אתכם להצטרף לקהילה שלנו, להשתתף בתפילות ובשיעורים, ולהיות חלק ממשפחת "חזון יוסף"'
            },
            quickLinks: {
              title: 'גישה מהירה'
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

    // POST/PUT - Protected, requires authentication
    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      console.log('💾 Write request received')
      
      // Verify authentication
      const { authenticated, user } = verifyAuth(context)
      if (!authenticated) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized - Authentication required' })
        }
      }

      const data = JSON.parse(event.body)
      console.log('📝 Saving site content for user:', user.email)
      
      const docRef = db.collection('settings').doc('siteContent')
      await docRef.set(data)
      
      console.log('✅ Site content saved successfully to Firebase')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Site content updated successfully',
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
    console.error('❌ ERROR in firebase-site-content function:', error)
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
