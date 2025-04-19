import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import I18nProvider from "./i18n/intl-provider";
import enDict from "./i18n/dictionaries/en.json";
import zhDict from "./i18n/dictionaries/zh.json";
import viDict from "./i18n/dictionaries/vi.json";
import GoogleAnalytics from "./components/google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata
export const metadata: Metadata = {
  title: "TTL Project",
  description: "A multilingual AI-powered application",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://ttl-project.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'vi': '/vi',
      'zh': '/zh'
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

// Prepare dictionaries
const dictionaries = {
  en: enDict,
  zh: zhDict,
  vi: viDict,
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: { locale?: string };
}>) {
  // Determine the current locale
  const locale = params?.locale || 'en';
  
  return (
    <html lang={locale} className="scroll-smooth">
      <GoogleAnalytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider messages={dictionaries}>
          {children}
          <Toaster position="top-center" />
        </I18nProvider>
      </body>
    </html>
  );
}
