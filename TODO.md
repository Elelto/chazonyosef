# 📋 TODO List - בית המדרש "חזון יוסף"

## ✅ הושלם
- [x] מבנה הפרויקט הבסיסי (React + Vite)
- [x] כל הדפים הראשיים (Home, PrayerTimes, Gallery, Newsletter, Contact)
- [x] מערכת Admin מלאה
- [x] Netlify Functions (prayer-times, events, announcements, gallery)
- [x] אינטגרציה עם Netlify Identity
- [x] תמיכה ב-RTL ועברית
- [x] עיצוב עם TailwindCSS
- [x] Navbar ו-Footer

---

## 🔴 חובה לעשות לפני Deploy

### 1. הגדרת EmailJS
- [ ] צור חשבון ב-[EmailJS](https://www.emailjs.com/)
- [ ] צור Service ו-Template
- [ ] צור קובץ `.env` מתוך `.env.example`
- [ ] הוסף את המפתחות:
  ```
  VITE_EMAILJS_SERVICE_ID=xxx
  VITE_EMAILJS_TEMPLATE_ID=xxx
  VITE_EMAILJS_PUBLIC_KEY=xxx
  ```

### 2. הגדרת Netlify
- [ ] צור אתר חדש ב-Netlify
- [ ] חבר את הריפו מ-GitHub
- [ ] הפעל **Netlify Identity** בהגדרות האתר
- [ ] הגדר Registration ל-**Invite Only**
- [ ] הוסף משתמש אדמין (את עצמך)

### 3. ⚠️ **Firebase - שינוי הגדרות אבטחה (חשוב!)** 🔥

✅ **האתר כבר עובד עם Firebase!**

**אבל - יש הגדרה קריטית לשנות:**

- [ ] **לשנות את Firestore Rules ממצב פיתוח לפרודקשן!**
  
  📍 היכן: [Firebase Console](https://console.firebase.google.com/) → Firestore Database → Rules
  
  ⚠️ **כרגע הכללים במצב פיתוח** (כולם יכולים לקרוא/לכתוב!)
  
  צריך לשנות ל:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // קריאה - כולם יכולים
      match /{document=**} {
        allow read: true;
      }
      
      // כתיבה - רק משתמשים מחוברים (Netlify Identity)
      match /{document=**} {
        allow write: if request.auth != null;
      }
    }
  }
  ```
  
  או אם אתה רוצה יותר אבטחה (רק אתה יכול לכתוב):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read: true;
        allow write: if request.auth.token.email == 'YOUR_EMAIL@gmail.com';
      }
    }
  }
  ```

---

## 🟡 אופציונלי (שיפורים)

### תוכן
- [ ] להוסיף תמונות אמיתיות לגלריה
- [ ] להוסיף את הלוגו האמיתי (להחליף את `public/logo.png`)
- [ ] לעדכן את פרטי ההתקשרות האמיתיים
- [ ] להוסיף תוכן לדף הבית

### פיצ'רים נוספים
- [ ] מערכת הודעות/התראות לגולשים
- [ ] אפשרות להוריד לוח שנה (iCal) של זמני התפילות
- [ ] גרסת PWA (Progressive Web App)
- [ ] מצב כהה (Dark Mode)
- [ ] שיתוף ברשתות חברתיות

### SEO ו-Performance
- [ ] להוסיף meta tags לכל דף
- [ ] להוסיף Open Graph tags
- [ ] לייעל תמונות (lazy loading)
- [ ] להוסיף sitemap.xml
- [ ] להוסיף robots.txt

---

## 🚀 סדר ביצוע מומלץ

1. ✅ ~~פתרון שמירת נתונים~~ - **Firebase כבר מוגדר!**
2. **🔴 שנה את Firebase Rules ממצב פיתוח לפרודקשן** (קריטי!)
3. **הגדר EmailJS** (לטופס יצירת קשר)
4. **הגדר Netlify Identity** (למערכת האדמין)
5. **בדוק שהכל עובד מקומית** (`npm run dev`)
6. **Deploy ל-Netlify** (`netlify deploy --prod`)
7. **בדוק באתר החי**
8. **הוסף תוכן אמיתי**

---

## 📞 שאלות?

אם אתה צריך עזרה - **פשוט שאל אותי!**
