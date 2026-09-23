import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <header className="siteHeader">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brandMark">IL</span><span>מספרי ישראל</span></Link>
          <nav className="navLinks" aria-label="ניווט ראשי">
            <Link href="/">ראשי</Link>
            <Link href="/about">איך זה עובד</Link>
            <Link href="/numbers">כל המספרים</Link>
          </nav>
          <Link className="navCta" href="/numbers">פתח מאגר</Link>
        </div>
      </header>
      <main>
        <section className="pageHero">
          <div className="container">
            <span className="eyebrow">מה ידוע ומה לא ידוע</span>
            <h1>מאיפה מגיעים המספרים?</h1>
            <p>
              משרד התקשורת מקצה לספקי טלפוניה טווחי מספור. האתר קורא את הטווחים,
              מזהה ספרות קבועות וספרות X, ומייצר את המספרים האפשריים בצורה חישובית.
            </p>
          </div>
        </section>
        <section className="section">
          <div className="container infoGrid">
            <aside className="infoPanel">
              <h2>דוגמה</h2>
              <p>טווח כמו <span className="code">050-2XXXXXX</span> מייצג מיליון צירופים.</p>
              <p className="code">050-2000000 → 050-2999999</p>
              <div className="notice">ניידות מספרים אומרת שהחברה שקיבלה את הטווח אינה בהכרח המפעיל הנוכחי.</div>
            </aside>
            <div className="infoPanel">
              <h2>הזרימה במערכת</h2>
              <div className="timeline">
                <Step n="1" title="טעינת טווחים" text="קריאת טווחי המספור ממקור רשמי או ממטמון עתידי." />
                <Step n="2" title="סינון סלולר" text="שמירת טווחים בתחום 05X בלבד." />
                <Step n="3" title="יצירה עצלה" text="המספרים נוצרים רק עבור העמוד שמוצג כרגע." />
                <Step n="4" title="חיבור סטטוס" text="סטטוס מגיע רק מ-CSV או API שלך, לא מניחוש." />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="timelineItem">
      <span className="timelineNum">{n}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
