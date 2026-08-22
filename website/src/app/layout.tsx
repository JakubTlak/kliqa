import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// PT Serif z DESIGN.md nie ma wagi 300, a to ona jest podpisem marki.
// Source Serif 4 to podstawienie wskazane wprost w DESIGN.md i ma pełny zakres 300–600.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE = "https://kliqa.pl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Kliqa — agencja marketingowa, która zamienia kliknięcia w przychód",
    template: "%s · Kliqa",
  },
  description:
    "Performance marketing w Google, Meta i TikTok, strony internetowe, SEO, automatyzacja procesów, wdrożenia AI i social media. Technologicznie i analitycznie.",
  keywords: [
    "agencja marketingowa",
    "performance marketing",
    "Google Ads",
    "Meta Ads",
    "TikTok Ads",
    "SEO",
    "automatyzacja marketingu",
    "wdrożenia AI",
  ],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE,
    siteName: "Kliqa",
    title: "Kliqa — zamieniamy kliknięcia w przychód",
    description:
      "Agencja marketingowa dla firm, które chcą wiedzieć, za co dokładnie płacą. Performance, web, SEO, automatyzacja, AI, social.",
  },
  alternates: { canonical: SITE },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body
        className={`${sourceSerif.variable} ${interTight.variable} ${jetbrains.variable}`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
