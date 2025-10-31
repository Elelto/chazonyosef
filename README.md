# בית המדרש "חזון יוסף" - אתר רשמי

## 📍 פרטים
- **שם**: בית המדרש "חזון יוסף"
- **כתובת**: בעל התניא 26, בני ברק
- **דומיין**: chazonyosef.org.il

## 🚀 טכנולוגיות
- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS + RTL Support
- **Backend**: Netlify Functions (Serverless)
- **Authentication**: Netlify Identity
- **Email**: EmailJS
- **Hosting**: Netlify

## 📦 התקנה

```bash
# התקנת תלויות
npm install

# הפעלת שרת פיתוח
npm run dev

# בנייה לפרודקשן
npm run build

# תצוגה מקדימה של הבנייה
npm run preview
```

## 🔧 הגדרות Netlify

### 1. Netlify Identity
- עבור לדשבורד Netlify
- הפעל Identity
- הגדר Registration: Invite Only
- הוסף משתמש אדמין

### 2. EmailJS
- צור חשבון ב-EmailJS
- צור `.env` מקובץ `.env.example`
- הוסף את המפתחות:
  ```
  VITE_EMAILJS_SERVICE_ID=your_service_id
  VITE_EMAILJS_TEMPLATE_ID=your_template_id
  VITE_EMAILJS_PUBLIC_KEY=your_public_key
  ```

### 3. Deploy
```bash
# התחבר ל-Netlify CLI
npm install -g netlify-cli
netlify login

# Deploy
netlify deploy --prod
```

## 📄 דפים
- **דף בית**: מידע כללי על בית המדרש
- **זמני תפילות**: תצוגה ועריכה (אדמין)
- **גלריה**: תמונות (ניתן לעריכה באדמין)
- **הרשמה לרשימת תפוצה**: טופס הרשמה
- **צור קשר**: פרטי התקשרות וטופס יצירת קשר
- **אדמין**: ממשק ניהול (מוגן בסיסמה)

## 🔐 גישת אדמין
- נווט ל-`/admin`
- התחבר עם Netlify Identity
- ערוך תוכן, תמונות, זמני תפילות

## 📱 תמיכה במובייל
האתר מותאם לחלוטין למובייל וטאבלט.

## 🎨 עיצוב
- תמיכה מלאה ב-RTL (עברית)
- צבעים: כחול וזהב (לפי הלוגו)
- גופנים: Heebo, Assistant

## 📞 תמיכה
לשאלות ותמיכה: contact@chazonyosef.org.il
