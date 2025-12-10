# 🔥 הגדרת Firebase - הוראות

## ⚠️ חשוב! המפתחות שלך נחשפו ב-GitHub

צריך לעשות את הדברים הבאים **עכשיו**:

---

## שלב 1: צור קובץ .env

צור קובץ בשם `.env` בתיקיית הפרויקט (ליד package.json) עם התוכן הבא:

```env
# EmailJS Configuration (אם יש לך)
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

# Firebase Configuration - המפתחות שלך
VITE_FIREBASE_API_KEY=AIzaSyCahm3Mr6eM4j0XACPDexiHCI7fq0wlI_E
VITE_FIREBASE_AUTH_DOMAIN=chazon-e3dc4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chazon-e3dc4
VITE_FIREBASE_STORAGE_BUCKET=chazon-e3dc4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=553870721683
VITE_FIREBASE_APP_ID=1:553870721683:web:e24bc7d0a90e8752df0366
VITE_FIREBASE_MEASUREMENT_ID=G-C9BJRBDLPG
```

---

## שלב 2: אבטח את Firebase

1. **לך ל-[Firebase Console](https://console.firebase.google.com/)**
2. **בחר את הפרויקט: chazon-e3dc4**
3. **לחץ על ⚙️ (Settings) → Project settings**
4. **גלול ל-"Your apps" → Web app**
5. **לחץ על "Regenerate API Key"** (זה יבטל את המפתח הישן)
6. **העתק את המפתח החדש** ושים אותו ב-.env

---

## שלב 3: הגדר Firebase Rules

ב-Firestore Database → Rules, שים:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: true;
      allow write: true;
    }
  }
}
```

**שים לב:** זה פתוח לכולם. בפרודקשן נשנה לאבטחה יותר טובה.

---

## שלב 4: הרץ מחדש את השרת

```bash
# עצור את השרת (Ctrl+C)
# הרץ מחדש:
npm run dev
```

---

## שלב 5: נקה את ההיסטוריה ב-Git (אופציונלי אבל מומלץ)

אם אתה רוצה למחוק את המפתחות מההיסטוריה של Git:

```bash
# התקן BFG Repo Cleaner
# או השתמש ב-git filter-branch
# זה מורכב - אפשר לדלג על זה אם רוטציה של המפתחות
```

**הכי פשוט:** רק תחליף את ה-API Key ב-Firebase ותמשיך הלאה.

---

## ✅ בדיקה

אחרי שתעשה את זה:
1. הרץ `npm run dev`
2. פתח http://localhost:3003/admin
3. בדוק שהכל עובד

---

## 🔐 ל-Netlify Deploy

כשתעלה ל-Netlify, תצטרך להוסיף את משתני הסביבה שם:

1. **Netlify Dashboard → Site settings → Environment variables**
2. **הוסף את כל המשתנים מה-.env**

זה יבטיח שהאתר יעבוד גם בפרודקשן.
