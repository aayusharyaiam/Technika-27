import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Experience } from "@/components/experience";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const garamond = localFont({ src: [
  { path: "../../public/fonts/garamond.woff2", weight: "400 800", style: "normal" },
  { path: "../../public/fonts/garamond-italic.woff2", weight: "400 800", style: "italic" },
], variable: "--font-garamond", display: "swap" });
const outfit = localFont({ src: "../../public/fonts/outfit.woff2", variable: "--font-outfit", display: "swap", weight: "300 700" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")),
  title: { default: "Technika ’27 — Where Technology Meets Magic", template: "%s | Technika ’27" },
  description: "Step into the wizarding world of Technika ’27, the techno-cultural festival of BIT Patna. Three days of technology, creativity, and extraordinary possibilities. January 8–10, 2027.",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: { title: "Technika ’27 — The Triwizard Tech Odyssey", description: "Something magical is coming to BIT Patna. January 8–10, 2027.", type: "website", images: [{ url: "/images/hogwarts.webp", width: 1376, height: 768, alt: "A moonlit Hogwarts castle — Technika 27" }] },
};

export const viewport: Viewport = { themeColor: "#0f0c19", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${garamond.variable} ${outfit.variable}`}><body>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Experience><Header /><main id="main-content" tabIndex={-1}>{children}</main><Footer /></Experience>
  </body></html>;
}
