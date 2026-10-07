import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Experience } from "@/components/experience";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { SiteSchema } from "@/components/structured-data";
import { indexable, siteUrl } from "@/lib/seo";
import "lenis/dist/lenis.css";
import "./globals.css";

const garamond = localFont({ src: [
  { path: "../../public/fonts/garamond.woff2", weight: "400 800", style: "normal" },
  { path: "../../public/fonts/garamond-italic.woff2", weight: "400 800", style: "italic" },
], variable: "--font-garamond", display: "swap" });
const outfit = localFont({ src: "../../public/fonts/outfit.woff2", variable: "--font-outfit", display: "swap", weight: "300 700" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Technika ’27 — Where Technology Meets Magic", template: "%s | Technika ’27" },
  description: "Step into the wizarding world of Technika ’27, the techno-cultural festival of BIT Patna. Three days of technology, creativity, and extraordinary possibilities. January 8–10, 2027.",
  applicationName: "Technika ’27",
  keywords: ["Technika 27", "Technika 2027", "BIT Patna fest", "BIT Patna techno cultural festival", "college fest Bihar", "Triwizard Tech Odyssey", "BIT Patna hackathon", "robotics festival Patna"],
  authors: [{ name: "Technika — BIT Patna" }],
  creator: "Technika — BIT Patna",
  category: "education",
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  robots: { index: indexable, follow: indexable, googleBot: { index: indexable, follow: indexable, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  openGraph: { title: "Technika ’27 — The Triwizard Tech Odyssey", description: "Technology, creativity, and a little magic at BIT Patna.", type: "website", locale: "en_IN", siteName: "Technika ’27 — BIT Patna", images: [{ url: "/images/social-card.jpg", width: 1200, height: 630, alt: "Technika 27 — The Triwizard Tech Odyssey" }] },
  twitter: { card: "summary_large_image", images: ["/images/social-card.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0f0c19", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${garamond.variable} ${outfit.variable}`}><body>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteSchema />
    <Experience><Header /><main id="main-content" tabIndex={-1}><PageTransition>{children}</PageTransition></main><Footer /></Experience>
  </body></html>;
}
