# 🔧 איך להפעיל Netlify Blobs

## הבעיה
Blobs לא מוגדר כראוי והסביבה לא מזהה אותו.

## פתרון: הפעל דרך Netlify CLI

### שלב 1: התקן Netlify CLI (אם עוד לא)
```bash
npm install -g netlify-cli
```

### שלב 2: התחבר ל-Netlify
```bash
netlify login
```

זה יפתח דפדפן - התחבר לחשבון שלך.

### שלב 3: קישור לפרויקט
```bash
cd c:\Users\24wow\Projects\Chzon-yosef
netlify link
```

בחר את האתר **chazonyosef**.

### שלב 4: הפעל Blobs
```bash
netlify blobs:create chazonyosef
```

זה ייצור את ה-store בשם "chazonyosef".

### שלב 5: בדוק שזה עובד
```bash
netlify blobs:list
```

אמור להראות את ה-store שיצרת.

---

## אם זה לא עובד

אז הבעיה היא ש-Netlify Blobs לא זמין בחשבון שלך (אולי צריך תוכנית בתשלום).

במקרה כזה, יש לנו 2 אופציות:

### אופציה 1: Firebase (מומלץ)
- ✅ חינמי לחלוטין
- ✅ קל להגדיר
- ✅ יציב מאוד
- ✅ תיעוד מצוין

### אופציה 2: Supabase
- ✅ חינמי
- ✅ מקצועי
- ✅ PostgreSQL
- ✅ Real-time

---

**נסה את השלבים למעלה ותגיד לי מה קרה!** 🚀
