import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteSchema } from "@/components/structured-data";
import { indexable, siteUrl } from "@/lib/seo";
import { SeoVault } from "@/components/seo-vault";
import { ComingSoonPortal } from "@/components/coming-soon-portal";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./reference-portal.css";

const garamond = localFont({
  src: [
    { path: "../../public/fonts/garamond.woff2", weight: "400 800", style: "normal" },
    { path: "../../public/fonts/garamond-italic.woff2", weight: "400 800", style: "italic" },
  ],
  variable: "--font-garamond",
  display: "swap",
});
const outfit = localFont({
  src: "../../public/fonts/outfit.woff2",
  variable: "--font-outfit",
  display: "swap",
  weight: "300 700",
});
const handwriting = localFont({
  src: "../../public/fonts/caveat.woff2",
  variable: "--font-handwriting",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Technika 2k27 — BIT Patna | Annual Techno-Cultural Festival",
    template: "%s | Technika 2k27",
  },
  description:
    "Official coming soon portal for Technika 2k27, the flagship annual techno-cultural festival of Birla Institute of Technology, Patna. Three days of engineering innovation, hackathons, robotics, coding, and creative excellence. January 8–10, 2027.",
  applicationName: "Technika 2k27",
  keywords: [
    "Technika 2k27",
    "Technika 2027",
    "Technika '27",
    "Technika BIT Patna",
    "Technika 2k27 BIT Patna",
    "BIT Patna fest",
    "BIT Patna techno cultural festival",
    "Birla Institute of Technology Patna fest",
    "college fest Bihar",
    "BIT Patna hackathon",
    "robotics festival Patna",
    "coding competition Bihar",
    "engineering college fest Patna",
    "Technika 2k27 registration",
    "BIT Mesra off campus Patna fest",
    "Technika fest 2027",
    "tech fest Bihar 2027",
  ],
  authors: [{ name: "Technika 2k27 — BIT Patna" }],
  creator: "Technika 2k27 — BIT Patna",
  category: "education",
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  robots: {
    index: indexable,
    follow: indexable,
    googleBot: {
      index: indexable,
      follow: indexable,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  openGraph: {
    title: "Technika 2k27 — BIT Patna | Annual Techno-Cultural Festival",
    description:
      "Official website for Technika 2k27, the flagship annual techno-cultural festival of Birla Institute of Technology (BIT) Patna. January 8–10, 2027.",
    type: "website",
    locale: "en_IN",
    siteName: "Technika 2k27 — BIT Patna",
    images: [
      {
        url: "/images/social-card.jpg",
        width: 1200,
        height: 630,
        alt: "Technika 2k27 — BIT Patna Annual Techno-Cultural Festival",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/social-card.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#08090e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${garamond.variable} ${outfit.variable} ${handwriting.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SiteSchema />
        <SeoVault />
        <ComingSoonPortal />
      </body>
    </html>
  );
}
