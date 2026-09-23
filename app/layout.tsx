import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מספרי ישראל",
  description: "כלי עברי להצגת מרחב מספרי הסלולר האפשריים בישראל לפי טווחי מספור.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
