"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RangeRecord = {
  pattern: string;
  prefix: string;
  xCount: number;
  count: number;
  operator: string;
  isM2M: boolean;
};

const pageSize = 50;
const fallbackRanges = [
  { pattern: "050-2XXXXXX", operator: "Pelephone / פלאפון" },
  { pattern: "052-3XXXXXX", operator: "Cellcom / סלקום" },
  { pattern: "054-2XXXXXX", operator: "Partner / פרטנר" },
  { pattern: "058-3XXXXXX", operator: "Golan Telecom / גולן" }
];

export default function NumbersPage() {
  const [ranges, setRanges] = useState<RangeRecord[]>([]);
  const [source, setSource] = useState("טוען טווחים...");
  const [query, setQuery] = useState("");
  const [operator, setOperator] = useState("");
  const [page, setPage] = useState(1);
  const [statuses, setStatuses] = useState<Record<string, "active" | "inactive" | "unknown">>({});

  useEffect(() => {
    loadRanges()
      .then((items) => {
        setRanges(items);
        setSource(`נטענו ${items.length.toLocaleString("he-IL")} טווחים`);
      })
      .catch(() => {
        const items = fallbackRanges.map((item) => parsePattern(item.pattern, item.operator)).filter(Boolean) as RangeRecord[];
        setRanges(items);
        setSource("מוצגים טווחי דוגמה כי מקור הנתונים לא נטען כרגע");
      });
  }, []);

  const filtered = useMemo(() => {
    const clean = query.replace(/\D/g, "");
    return ranges
      .filter((item) => !operator || item.operator === operator)
      .map((item) => intersect(item, clean))
      .filter(Boolean) as RangeRecord[];
  }, [operator, query, ranges]);

  const total = filtered.reduce((sum, item) => sum + item.count, 0);
  const rows = generateRows(filtered, (page - 1) * pageSize, pageSize);
  const operators = [...new Set(ranges.map((item) => item.operator))].sort();
  const maxPage = Math.max(1, Math.ceil(total / pageSize));

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
        </div>
      </header>
      <main>
        <section className="pageHero">
          <div className="container">
            <span className="eyebrow">מחולל מספרים דינמי</span>
            <h1>כל מספרי הסלולר האפשריים בישראל</h1>
            <p>סטטוס פעיל מוצג רק אם נטען מקור בדיקה. ברירת המחדל היא לא נבדק.</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="notice"><strong>סטטוס:</strong> אין כאן HLR בתשלום. אפשר לייבא CSV עם phone,status כדי לסמן תוצאות.</div>
            <div className="statsGrid">
              <Stat label="מספרים אפשריים" value={total.toLocaleString("he-IL")} />
              <Stat label="טווחים בתצוגה" value={filtered.length.toLocaleString("he-IL")} />
              <Stat label="מקור" value={source} small />
            </div>
            <section className="panel">
              <div className="panelBody filters">
                <label className="field">
                  <span>חיפוש מספר / קידומת</span>
                  <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="0502 או 0502345678" inputMode="numeric" />
                </label>
                <label className="field">
                  <span>הקצאת טווח</span>
                  <select value={operator} onChange={(e) => { setOperator(e.target.value); setPage(1); }}>
                    <option value="">כל החברות</option>
                    {operators.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                </label>
                <label className="ghostButton uploadLabel">
                  ייבוא CSV
                  <input hidden type="file" accept=".csv,text/csv" onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setStatuses(parseCsv(await file.text()));
                    event.target.value = "";
                  }} />
                </label>
              </div>
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>מספר</th>
                      <th>טווח</th>
                      <th>הוקצה ל</th>
                      <th>סטטוס</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ phone, range }) => (
                      <tr key={phone}>
                        <td className="phoneNumber">{formatPhone(phone)}</td>
                        <td><span className="code">{range.pattern}</span></td>
                        <td>{range.operator}</td>
                        <td><StatusBadge status={statuses[phone] ?? "unknown"} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <span>עמוד {page.toLocaleString("he-IL")} מתוך {maxPage.toLocaleString("he-IL")}</span>
                <div>
                  <button className="ghostButton" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>הקודם</button>
                  <button className="ghostButton" disabled={page >= maxPage} onClick={() => setPage((p) => p + 1)}>הבא</button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return <div className="statCard"><div className="statLabel">{label}</div><div className={small ? "statValue small" : "statValue"}>{value}</div></div>;
}

function StatusBadge({ status }: { status: "active" | "inactive" | "unknown" }) {
  const label = status === "active" ? "פעיל" : status === "inactive" ? "לא פעיל" : "לא נבדק";
  return <span className={`badge ${status}`}>{label}</span>;
}

async function loadRanges() {
  const resourceId = "caa80822-5880-4bbf-808a-06d7f53c4ae5";
  const response = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=${resourceId}&limit=1000`);
  if (!response.ok) throw new Error("Failed to load");
  const data = await response.json();
  const records = data?.result?.records ?? [];
  return records
    .map((record: Record<string, unknown>) => parsePattern(String(record["Dialing Within Israel"] ?? ""), String(record["Allocated To"] ?? "לא ידוע"), String(record.Notes ?? "")))
    .filter(Boolean) as RangeRecord[];
}

function parsePattern(pattern: string, operator: string, notes = "") {
  if (!/^05\d-/.test(pattern)) return null;
  const normalized = pattern.replace(/[^0-9X]/gi, "").toUpperCase();
  const firstX = normalized.indexOf("X");
  if (firstX < 0) return null;
  const prefix = normalized.slice(0, firstX);
  const xCount = normalized.length - firstX;
  if (!/^X+$/.test(normalized.slice(firstX))) return null;
  return { pattern, prefix, xCount, count: 10 ** xCount, operator: formatOperator(operator), isM2M: /m2m/i.test(notes) };
}

function intersect(range: RangeRecord, query: string) {
  if (!query) return range;
  if (query.length <= range.prefix.length) return range.prefix.startsWith(query) ? range : null;
  if (!query.startsWith(range.prefix)) return null;
  const typed = query.slice(range.prefix.length);
  if (typed.length > range.xCount) return null;
  return { ...range, prefix: query, xCount: range.xCount - typed.length, count: 10 ** (range.xCount - typed.length) };
}

function generateRows(ranges: RangeRecord[], start: number, limit: number) {
  const rows: { phone: string; range: RangeRecord }[] = [];
  let cursor = 0;
  for (const range of ranges) {
    const end = cursor + range.count;
    if (end > start && rows.length < limit) {
      const from = Math.max(0, start - cursor);
      for (let i = from; i < range.count && rows.length < limit; i++) {
        rows.push({ phone: range.prefix + String(i).padStart(range.xCount, "0"), range });
      }
    }
    cursor = end;
    if (rows.length >= limit) break;
  }
  return rows;
}

function parseCsv(text: string) {
  const map: Record<string, "active" | "inactive" | "unknown"> = {};
  for (const line of text.split(/\r?\n/).slice(1)) {
    const [phoneRaw, statusRaw] = line.split(",").map((item) => item?.trim());
    const phone = String(phoneRaw ?? "").replace(/\D/g, "");
    if (!/^05\d{8}$/.test(phone)) continue;
    const status = String(statusRaw ?? "").toLowerCase();
    map[phone] = ["active", "פעיל", "1", "true"].includes(status) ? "active" : ["inactive", "לא פעיל", "0", "false"].includes(status) ? "inactive" : "unknown";
  }
  return map;
}

function formatPhone(phone: string) {
  return `${phone.slice(0, 3)}-${phone.slice(3)}`;
}

function formatOperator(name: string) {
  if (/pelephone/i.test(name)) return "Pelephone / פלאפון";
  if (/cellcom/i.test(name)) return "Cellcom / סלקום";
  if (/partner/i.test(name)) return "Partner / פרטנר";
  if (/golan/i.test(name)) return "Golan Telecom / גולן";
  if (/hot/i.test(name)) return "HOT Mobile";
  return name || "לא ידוע";
}
