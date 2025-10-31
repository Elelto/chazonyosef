# 🔍 איך לבדוק לוגים ב-Netlify

## שלב 1: כנס ל-Netlify Dashboard

1. גלוש ל: https://app.netlify.com
2. התחבר לחשבון שלך
3. בחר את האתר: **chazonyosef**

## שלב 2: בדוק את סטטוס הבנייה

1. לחץ על **Deploys** בתפריט העליון
2. בדוק את הבנייה האחרונה:
   - ✅ **Published** (ירוק) = הבנייה הצליחה
   - 🔄 **Building** (כתום) = עדיין בונה
   - ❌ **Failed** (אדום) = הבנייה נכשלה

### אם הבנייה נכשלה:
לחץ על הבנייה וקרא את הלוגים. חפש שגיאות.

## שלב 3: בדוק לוגי הפונקציות

1. לחץ על **Functions** בתפריט העליון
2. בחר את הפונקציה: **prayer-times**
3. לחץ על **Function log**

### מה לחפש בלוגים:

#### ✅ אם הפונקציה עובדת:
```
🔵 Prayer Times Function Called: {method: 'GET', ...}
👤 User authenticated: {hasUser: false, ...}
📖 GET request - fetching prayer times
✅ Prayer times fetched: (from store)
```

#### ❌ אם יש שגיאה:
```
Error: Cannot find module '@netlify/blobs'
```
או
```
SyntaxError: Unexpected token 'import'
```
או
```
Error loading function
```

## שלב 4: בדוק את הגדרות Netlify Blobs

1. לחץ על **Storage** בתפריט העליון
2. ודא ש-**Netlify Blobs** מופעל
3. אם לא - הפעל אותו

## בעיות נפוצות ופתרונות

### 🔴 בעיה: "Cannot find module '@netlify/blobs'"
**פתרון:**
הפונקציות לא מצאו את החבילה. זה יכול לקרות אם:
1. ה-node_modules לא הועלה (נכון - לא צריך להעלות)
2. Netlify לא התקין את התלויות

**תיקון:**
ודא שיש `netlify/functions/package.json` עם התלויות.

### 🔴 בעיה: "Unexpected token 'import'"
**פתרון:**
הפונקציות עדיין משתמשות ב-ES6 imports.

**תיקון:**
ודא שהפונקציות משתמשות ב-`require` ולא `import`.

### 🔴 בעיה: "Function execution timed out"
**פתרון:**
הפונקציה לוקחת יותר מדי זמן.

**תיקון:**
בדוק את הלוגים לראות איפה היא תקועה.

## מה לעשות עכשיו

1. **בדוק את הלוגים** ב-Netlify Dashboard
2. **העתק את השגיאה** שאתה רואה
3. **שתף אותי** את השגיאה ואני אעזור לתקן

## קישורים מהירים

- Dashboard: https://app.netlify.com/sites/chazonyosef
- Deploys: https://app.netlify.com/sites/chazonyosef/deploys
- Functions: https://app.netlify.com/sites/chazonyosef/functions
- Storage: https://app.netlify.com/sites/chazonyosef/storage

---

**חשוב:** אם אתה רואה 502 זה אומר שהפונקציה קורסת. הלוגים יגידו לנו למה.
