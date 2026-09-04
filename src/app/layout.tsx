import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/I18nContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nouri-normal.vercel.app"),
  title: "Nouri — Скласти меню з того, що є",
  description: "Введи продукти з холодильника, вкажи калорії — отримай готове меню на тиждень. Без підрахунків та планування.",
  keywords: [
    "меню на тиждень", "планування їжі", "калькулятор калорій", "харчування",
    "recipe planner", "meal prep", "weekly meal plan", "calorie calculator",
    "Wochenplan", "Mahlzeitenplanung", "Kalorienrechner",
  ],
  authors: [{ name: "Nouri" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "uk_UK",
    alternateLocale: "de_DE",
    siteName: "Nouri",
    title: "Nouri — Скласти меню з того, що є",
    description: "Введи продукти з холодильника, вкажи калорії — отримай готове меню на тиждень.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Nouri — Скласти меню з того, що є" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nouri — Скласти меню з того, що є",
    description: "Введи продукти з холодильника, вкажи калорії — отримай готове меню на тиждень.",
    images: ["/og.png"],
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
