import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nouri — Скласти меню з того, що є",
  description: "Введи продукти з холодильника, вкажи калорії — отримай готове меню на тиждень. Без підрахунків та планування.",
  keywords: [
    "меню на тиждень", "планування їжі", "калькулятор калорій", "харчування",
    "recipe planner", "meal prep", "weekly meal plan", "calorie calculator",
    "Wochenplan", "Mahlzeitenplanung", "Kalorienrechner",
  ],
  authors: [{ name: "Nouri" }],
  openGraph: {
    type: "website",
    locale: "uk_UK",
    alternateLocale: "de_DE",
    siteName: "Nouri",
    title: "Nouri — Скласти меню з того, що є",
    description: "Введи продукти з холодильника, вкажи калорії — отримай готове меню на тиждень.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nouri — Скласти меню з того, що є",
    description: "Введи продукти з холодильника, вкажи калорії — отримай готове меню на тиждень.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#fafafa" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
