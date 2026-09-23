import Link from "next/link";

const previewRows = [
  ["050-2XXXXXX", "פלאפון", "לא נבדק"],
  ["052-3XXXXXX", "סלקום", "לא נבדק"],
  ["054-2XXXXXX", "פרטנר", "לא נבדק"]
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container heroGrid">
            <div>
              <span className="eyebrow">טווחים רשמיים, סטטוס רק ממקור בדיקה</span>
              <h1>כלי עברי לבדיקת מרחב מספרי הסלולר בישראל</h1>
              <p>
                האתר מציג מספרי סלולר אפשריים לפי טווחי מספור, מסביר למי הוקצה כל טווח,
                ומאפשר לסמן פעיל או לא פעיל רק כשיש קובץ או API שמחזיר סטטוס.
              </p>
              <div className="actions">
                <Link className="primaryButton" href="/numbers">לצפייה במספרים</Link>
                <Link className="ghostButton" href="/about">איך זה עובד?</Link>
              </div>
            </div>
            <div className="previewCard" aria-label="תצוגה מקדימה של מספרים">
              <div className="phonePreview">
                <div className="phoneRow head">
                  <strong>טווח</strong>
                  <strong>הוקצה ל</strong>
                  <strong>סטטוס</strong>
                </div>
                {previewRows.map(([pattern, operator, status]) => (
                  <div className="phoneRow" key={pattern}>
                    <span className="phoneNumber">{pattern}</span>
                    <span>{operator}</span>
                    <span className="badge unknown">{status}</span>
                  </div>
                ))}
              </div>
              <div className="notice">
                <strong>חשוב:</strong> טווח שהוקצה אינו הוכחה שמספר מסוים פעיל כיום.
              </div>
            </div>
          </div>
        </section>
        <section className="section white">
          <div className="container">
            <div className="sectionHead">
              <h2>מה האתר יודע להפריד?</h2>
              <p>ההפרדה הזו מונעת הצגה של מידע משוער כאילו הוא מידע ודאי.</p>
            </div>
            <div className="cards">
              <InfoCard n="01" title="מספר אפשרי" text="המספר מתאים לטווח שהוקצה בתוכנית המספור." />
              <InfoCard n="02" title="הקצאת טווח" text="מוצגת החברה שקיבלה את הטווח המקורי. ניידות מספרים יכולה לשנות את המפעיל בפועל." />
              <InfoCard n="03" title="סטטוס קו" text="פעיל או לא פעיל מוצג רק כאשר נטען CSV או מחובר API ייעודי." />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoCard({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <article className="card">
      <div className="cardIcon">{n}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function SiteHeader() {
  return (
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
  );
}

function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="container footerInner">
        <span>מספרי ישראל</span>
        <span>כלי מידע והמחשה, לא מאגר מנויים רשמי.</span>
      </div>
    </footer>
  );
}
