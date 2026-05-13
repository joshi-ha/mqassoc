import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: ["400"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ASSOC — Macquarie University Actuarial Students' Society",
    template: "%s | ASSOC",
  },
  description:
    "The Macquarie University Actuarial Students' Society (ASSOC) is a student-led community focused on supporting students through their actuarial journey — from first-year fundamentals to graduate careers.",
  keywords: ["actuarial", "Macquarie University", "students society", "ASSOC", "actuarial science"],
  openGraph: {
    title: "ASSOC — Macquarie University Actuarial Students' Society",
    description: "Building Tomorrow's Actuaries Today",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-cream)] text-[var(--color-text)] antialiased">
        {children}
      </body>
    </html>
  );
}
