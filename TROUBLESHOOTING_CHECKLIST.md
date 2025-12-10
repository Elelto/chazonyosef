# רשימת בדיקות לפתרון בעיות

## 🔍 מה לבדוק כשלא מצליח להיכנס

### 1. האם עשית Deploy אחרי הגדרת Environment Variables?

❌ **טעות נפוצה**: הגדרת משתנים ב-Netlify אבל לא עשית Deploy מחדש.

✅ **פתרון**:
```bash
git commit --allow-empty -m "Trigger redeploy after env vars"
git push
```

או לחץ **Trigger deploy** ב-Netlify Dashboard.

---

### 2. האם התקנת את firebase-admin?

❌ **טעות נפוצה**: לא הרצת `npm install` בתיקיית Functions.

✅ **פתרון**:
```bash
cd netlify/functions
npm install
git add package-lock.json
git commit -m "Install firebase-admin"
git push
```

---

### 3. האם FIREBASE_PRIVATE_KEY נכון?

זו הבעיה הכי נפוצה! 

❌ **לא נכון** (שורות חדשות אמיתיות):
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhki...
-----END PRIVATE KEY-----
```

✅ **נכון** (\\n כטקסט):
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhki...\n-----END PRIVATE KEY-----\n
```

**איך להעתיק נכון**:
1. פתח את קובץ ה-JSON מ-Firebase
2. מצא את השדה `"private_key"`
3. העתק את הערך **כולל המרכאות**
4. הדבק ב-Netlify
5. הסר את המרכאות בהתחלה ובסוף בלבד

---

### 4. האם כל 5 המשתנים מוגדרים?

בדוק ב-Netlify Dashboard > Site settings > Environment variables:

- [ ] `FIREBASE_PROJECT_ID` = `chazon-e3dc4`
- [ ] `FIREBASE_PRIVATE_KEY_ID` = (מקובץ JSON)
- [ ] `FIREBASE_PRIVATE_KEY` = (מקובץ JSON - עם \\n)
- [ ] `FIREBASE_CLIENT_EMAIL` = (משהו כמו `firebase-adminsdk-xxxxx@chazon-e3dc4.iam.gserviceaccount.com`)
- [ ] `FIREBASE_CLIENT_ID` = (מקובץ JSON)

---

### 5. האם עדכנת את Firebase Rules?

✅ **בדוק**:
1. עבור ל-[Firebase Console](https://console.firebase.google.com/)
2. בחר **chazon-e3dc4**
3. **Firestore Database** > **Rules**
4. ודא שהכללים הם:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

5. לחץ **Publish**

---

### 6. מה השגיאה המדויקת?

#### איפה לראות שגיאות:

**א. בדפדפן (F12 > Console)**:
- פתח את ממשק האדמין
- לחץ F12
- עבור ל-Console
- מה כתוב שם?

**ב. ב-Netlify Functions Logs**:
1. Netlify Dashboard
2. **Functions** בתפריט הצד
3. לחץ על `firebase-prayer-times`
4. ראה **Logs**
5. מה כתוב שם?

**ג. בפונקציית הבדיקה**:
גש ל:
```
https://your-site.netlify.app/.netlify/functions/test-firebase
```

מה התוצאה?

---

## 🎯 שגיאות נפוצות ופתרונות

### שגיאה: "Missing required environment variables"

**משמעות**: לא כל המשתנים מוגדרים ב-Netlify.

**פתרון**:
1. בדוק שכל 5 המשתנים קיימים
2. Deploy מחדש

---

### שגיאה: "Invalid service account" / "auth/invalid-credential"

**משמעות**: ה-FIREBASE_PRIVATE_KEY לא נכון.

**פתרון**:
1. העתק שוב את ה-private_key מקובץ JSON
2. ודא שיש `\n` כטקסט (לא שורות חדשות אמיתיות)
3. Deploy מחדש

---

### שגיאה: "Project ID mismatch"

**משמעות**: ה-FIREBASE_PROJECT_ID לא תואם.

**פתרון**:
1. ודא ש-FIREBASE_PROJECT_ID הוא `chazon-e3dc4`
2. Deploy מחדש

---

### שגיאה: "Unauthorized" / 401

**משמעות**: לא מחובר ב-Netlify Identity.

**פתרון**:
1. לחץ על "התחבר" בממשק האדמין
2. התחבר עם Netlify Identity
3. נסה שוב

---

### שגיאה: "Permission denied" מ-Firebase

**משמעות**: Firebase Rules לא מעודכנים.

**פתרון**:
1. עדכן את Firebase Rules (ראה שלב 5 למעלה)
2. Publish את הכללים

---

### האתר לא נטען בכלל

**פתרון**:
1. בדוק ב-Netlify Dashboard > **Deploys** - מה הסטטוס?
2. אם יש שגיאת Build - ראה את הלוג
3. אולי צריך להתקין dependencies:
   ```bash
   cd netlify/functions
   npm install
   git add .
   git commit -m "Add dependencies"
   git push
   ```

---

## 📞 מה לשלוח אם זה לא עובד

אם עדיין לא עובד, שלח:

1. **צילום מסך** של Environment Variables ב-Netlify (טשטש ערכים!)
2. **הלוגים** מ-Netlify Functions
3. **התוצאה** מ-`/.netlify/functions/test-firebase`
4. **השגיאה** מה-Console של הדפדפן (F12)
5. **הסטטוס** של ה-Deploy האחרון ב-Netlify

---

## ✅ רשימת בדיקה מהירה

לפני שאתה שואל עזרה, ודא:

- [ ] הרצתי `npm install` בתיקיית `netlify/functions`
- [ ] כל 5 המשתנים מוגדרים ב-Netlify
- [ ] ה-FIREBASE_PRIVATE_KEY כולל `\n` כטקסט
- [ ] עשיתי Deploy אחרי הגדרת המשתנים
- [ ] עדכנתי את Firebase Rules ל-read-only
- [ ] פרסמתי את Firebase Rules
- [ ] בדקתי את הלוגים ב-Netlify Functions
- [ ] בדקתי את ה-Console בדפדפן (F12)
- [ ] ניסיתי את `/.netlify/functions/test-firebase`
