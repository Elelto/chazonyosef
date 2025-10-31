# Netlify Functions

## התקנה

לפני deploy, הרץ:

```bash
cd netlify/functions
npm install
cd ../..
```

זה יתקין את `@netlify/blobs` בתיקיית הפונקציות.

## מבנה

כל הפונקציות משתמשות ב-CommonJS (require) ולא ES6 (import).

זה חשוב כי ה-package.json הראשי מוגדר עם `"type": "module"`.

## פונקציות זמינות

- `prayer-times.js` - ניהול זמני תפילות
- `events.js` - ניהול אירועים ושיעורים
- `announcements.js` - ניהול הודעות
- `gallery.js` - ניהול גלריית תמונות

כל הפונקציות משתמשות ב-Netlify Blobs לאחסון נתונים.
