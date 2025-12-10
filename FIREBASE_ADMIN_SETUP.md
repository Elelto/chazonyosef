# הגדרת Firebase Admin SDK ב-Netlify

## שלב 1: יצירת Service Account ב-Firebase

1. היכנס ל-[Firebase Console](https://console.firebase.google.com/)
2. בחר את הפרויקט שלך: **chazon-e3dc4**
3. לחץ על ⚙️ **Project Settings** (הגדרות פרויקט)
4. עבור ללשונית **Service Accounts**
5. לחץ על **Generate New Private Key** (צור מפתח פרטי חדש)
6. שמור את קובץ ה-JSON שהורד

## שלב 2: הוספת Environment Variables ב-Netlify

1. היכנס ל-[Netlify Dashboard](https://app.netlify.com/)
2. בחר את האתר שלך
3. עבור ל-**Site settings** > **Environment variables**
4. הוסף את המשתנים הבאים מקובץ ה-JSON שהורדת:

### משתנים נדרשים:

```
FIREBASE_PROJECT_ID=chazon-e3dc4
FIREBASE_PRIVATE_KEY_ID=[העתק מ-private_key_id בקובץ JSON]
FIREBASE_PRIVATE_KEY=[העתק מ-private_key בקובץ JSON - כולל \n]
FIREBASE_CLIENT_EMAIL=[העתק מ-client_email בקובץ JSON]
FIREBASE_CLIENT_ID=[העתק מ-client_id בקובץ JSON]
```

### ⚠️ חשוב לגבי FIREBASE_PRIVATE_KEY:

המפתח הפרטי מכיל תווי `\n` (שורה חדשה). יש להעתיק אותו **בדיוק כמו שהוא** מהקובץ JSON, כולל כל התווים המיוחדים.

דוגמה:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

## שלב 3: עדכון Firebase Rules

עבור ל-**Firestore Database** > **Rules** והחלף את הכללים הקיימים ב:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to everyone
    match /{document=**} {
      allow read: if true;
    }
    
    // Deny all write access from client
    // All writes must go through Netlify Functions
    match /{document=**} {
      allow write: if false;
    }
  }
}
```

לחץ על **Publish** לפרסום הכללים.

## שלב 4: התקנת Dependencies

הרץ את הפקודה הבאה בתיקיית הפרויקט:

```bash
cd netlify/functions
npm install
```

## שלב 5: בדיקה מקומית (אופציונלי)

אם אתה רוצה לבדוק מקומית, צור קובץ `.env` בשורש הפרויקט עם המשתנים:

```env
FIREBASE_PROJECT_ID=chazon-e3dc4
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
```

**⚠️ אל תעלה את קובץ .env ל-Git!** (הוא כבר ב-.gitignore)

## שלב 6: Deploy

לאחר הגדרת כל המשתנים ב-Netlify:

```bash
git add .
git commit -m "Add Firebase Admin SDK integration"
git push
```

Netlify יבנה ויפרוס את האתר אוטומטית.

## בדיקת תקינות

1. היכנס לממשק האדמין: `https://your-site.netlify.app/admin`
2. התחבר עם Netlify Identity
3. נסה לשמור שינויים בכל אחד מהמודולים
4. בדוק את ה-Console ב-DevTools - אמור לראות:
   - `✅ Prayer times saved successfully`
   - `✅ Gallery saved successfully`
   - וכו'

## פתרון בעיות

### שגיאת Authentication
- ודא שהמשתמש מחובר ב-Netlify Identity
- בדוק שה-token מועבר בכותרות הבקשה

### שגיאת Firebase Admin
- ודא שכל המשתנים מוגדרים נכון ב-Netlify
- בדוק שה-FIREBASE_PRIVATE_KEY כולל את כל התווים המיוחדים
- ודא שה-Service Account פעיל ב-Firebase Console

### שגיאת Permissions
- ודא שעדכנת את Firebase Rules
- בדוק שהכללים פורסמו בהצלחה

## מה השתנה?

### לפני:
- ❌ הדפדפן כתב ישירות ל-Firebase
- ❌ מפתחות Firebase חשופים בקוד הלקוח
- ❌ כל אחד יכול לעקוף את האבטחה

### אחרי:
- ✅ כל הכתיבה דרך Netlify Functions
- ✅ מפתחות Firebase מוסתרים בשרת
- ✅ רק משתמשים מחוברים יכולים לשנות נתונים
- ✅ Firebase Rules מונעים כתיבה ישירה מהדפדפן
