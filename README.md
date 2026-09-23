# Israel Phone Index

אתר Next.js בעברית להצגת מרחב מספרי הסלולר האפשריים בישראל לפי טווחי מספור.

## מה יש עכשיו

- עמוד ראשי בעברית ו-RTL.
- עמוד הסבר על טווחי מספור.
- עמוד מספרים דינמי עם חיפוש, סינון, pagination וייבוא CSV סטטוסים.
- אין HLR בתשלום ואין ניחוש של פעיל/לא פעיל.

## פיתוח

```bash
npm install
npm run dev
```

## סטטוס פעיל / לא פעיל

ברירת המחדל היא `לא נבדק`.

אפשר לייבא CSV:

```csv
phone,status
0501234567,active
0501234568,inactive
```

## Supabase

קיים קובץ migration בסיסי תחת:

```text
supabase/migrations/0001_initial.sql
```

הוא מוכן לשימוש עתידי אם מחברים Supabase חינמי.
