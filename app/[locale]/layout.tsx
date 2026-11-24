import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { DirectionProvider } from "@radix-ui/react-direction";
import { Inter, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crisis AI Pilot — Bilingual Command Platform",
  description:
    "Bilingual (English/Arabic) crisis lifecycle command platform for GCC enterprises: preparedness, activation, notification, escalation, recovery and audit.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
  openGraph: {
    title: "Crisis AI Pilot — Executive Command Center",
    description: "Critical national infrastructure bilingual incident response & continuity platform",
    siteName: "Crisis AI Pilot",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontVariables = `${inter.variable} ${ibmPlexSansArabic.variable} ${jetbrainsMono.variable}`;
  const activeFontClass = dir === "rtl" ? ibmPlexSansArabic.className : inter.className;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontVariables} ${activeFontClass}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen">
        <DirectionProvider dir={dir}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
