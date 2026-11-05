import type { Metadata, Viewport } from "next";
import { Chakra_Petch, JetBrains_Mono, Manrope } from "next/font/google";
import { BackToTop } from "@/components/layout/BackToTop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, type HeaderNextRace } from "@/components/layout/SiteHeader";
import { getNextRace } from "@/lib/races";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Hypercar Endurance Team`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630, alt: "Apex Velocita Racing AVR-26 illustration" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const dynamic = "force-dynamic";

async function loadNextRace(now: Date): Promise<HeaderNextRace> {
  try {
    const race = await getNextRace(now);
    return race ? { slug: race.slug, shortName: race.shortName, startDate: race.startDate, endDate: race.endDate } : null;
  } catch (err) {
    console.error("[layout] could not load next race:", err);
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const nextRace = await loadNextRace(now);
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <SiteHeader nextRace={nextRace} initialNow={now.getTime()} />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
