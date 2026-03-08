import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Fonts ───────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Expiro — La traçabilité qui anticipe vos DLC",
  description:
    "Expiro helps supermarkets, restaurants, and fresh food businesses prevent product loss, simplify expiry tracking, and stay HACCP compliant.",
  keywords: [
    "DLC traceability",
    "food waste",
    "HACCP",
    "expiry tracking",
    "food safety",
  ],
  openGraph: {
    title: "Expiro — Stop Food Waste. Increase Your Margin.",
    description:
      "Full DLC traceability in one platform. Automated alerts, real-time tracking, multi-user access.",
    type: "website",
  },
};

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} font-inter`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-[#F7FCF9] text-[#121C15] selection:bg-green-200 selection:text-green-900">
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}