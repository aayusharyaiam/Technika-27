import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Experience } from "@/components/experience";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { SiteSchema } from "@/components/structured-data";
import { indexable, siteUrl } from "@/lib/seo";
import { HouseProvider } from "@/components/house-provider";
import { AuthProvider } from "@/components/auth-provider";
import { houseBootScript } from "@/lib/houses";
import { SeoVault } from "@/components/seo-vault";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./wizarding.css";
import "./reference-portal.css";

const garamond = localFont({ src: [
  { path: "../../public/fonts/garamond.woff2", weight: "400 800", style: "normal" },
  { path: "../../public/fonts/garamond-italic.woff2", weight: "400 800", style: "italic" },
], variable: "--font-garamond", display: "swap" });
const outfit = localFont({ src: "../../public/fonts/outfit.woff2", variable: "--font-outfit", display: "swap", weight: "300 700" });
const handwriting = localFont({ src: "../../public/fonts/caveat.woff2", variable: "--font-handwriting", display: "swap", weight: "400 700" });
const harryp = localFont({ src: "../../public/fonts/HarryP.ttf", variable: "--font-harryp", display: "swap" });

import { ComingSoonPortal } from "@/components/coming-soon-portal";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Technika 2k27 — BIT Patna | Where Technology Meets Magic", template: "%s | Technika 2k27" },
  description: "Step into the wizarding world of Technika 2k27, the premier techno-cultural festival of BIT Patna. Three days of technology, creativity, hackathons, robotics, and extraordinary possibilities. January 8–10, 2027.",
  applicationName: "Technika 2k27",
  keywords: [
    "Technika 2k27", "Technika 2027", "Technika '27", "Technika BIT Patna", "Technika 2k27 BIT Patna",
    "BIT Patna fest", "BIT Patna techno cultural festival", "Birla Institute of Technology Patna fest",
    "college fest Bihar", "Triwizard Tech Odyssey", "BIT Patna hackathon", "robotics festival Patna",
    "coding competition Bihar", "engineering college fest Patna", "Technika 2k27 registration",
    "BIT Mesra off campus Patna fest", "Technika fest 2027", "tech fest Bihar 2027"
  ],
  authors: [{ name: "Technika 2k27 — BIT Patna" }],
  creator: "Technika 2k27 — BIT Patna",
  category: "education",
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  robots: { index: indexable, follow: indexable, googleBot: { index: indexable, follow: indexable, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  openGraph: { title: "Technika 2k27 — BIT Patna | The Triwizard Tech Odyssey", description: "Official website for Technika 2k27, the flagship annual techno-cultural festival of Birla Institute of Technology (BIT) Patna. January 8–10, 2027.", type: "website", locale: "en_IN", siteName: "Technika 2k27 — BIT Patna", images: [{ url: "/images/social-card.jpg", width: 1200, height: 630, alt: "Technika 2k27 — BIT Patna, The Triwizard Tech Odyssey" }] },
  twitter: { card: "summary_large_image", images: ["/images/social-card.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0f0c19", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${garamond.variable} ${outfit.variable} ${handwriting.variable} ${harryp.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Henny+Penny&family=MedievalSharp&display=swap" rel="stylesheet" />
        <script id="restore-house-theme" dangerouslySetInnerHTML={{ __html: houseBootScript }} />
      </head>
      <body>
        <SiteSchema />
        <SeoVault />
        <ComingSoonPortal />
      </body>
    </html>
  );
}
