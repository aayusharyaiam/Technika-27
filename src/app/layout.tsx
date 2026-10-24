import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Experience } from "@/components/experience";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { SiteSchema } from "@/components/structured-data";
import { indexable, siteUrl } from "@/lib/seo";
import { HouseProvider } from "@/components/house-provider";
import { AuthProvider } from "@/components/auth-provider";
import { SmoothScroll } from "@/components/smoothScroll";
import { LeafReveal } from "@/components/leaf-reveal";
import { houseBootScript } from "@/lib/houses";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./wizarding.css";
import "./marauders-map.css";
import "./reference-portals.css";

const garamond = localFont({
  src: [
    {
      path: "../../public/fonts/garamond.woff2",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "../../public/fonts/garamond-italic.woff2",
      weight: "400 800",
      style: "italic",
    },
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
const harryP = localFont({
  src: "../../public/fonts/HarryP.ttf",
  variable: "--font-harryp",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Technika 2K26 — BIT Patna Technical Festival",
    template: "%s | Technika 2K26",
  },
  description:
    "Step into Technika 2K26, the annual technical festival of BIT Patna. Three days of innovation, creativity, competitions, and extraordinary possibilities. January 16–18, 2026.",
  applicationName: "Technika 2K26",
  keywords: [
    "Technika 2K26",
    "Technika 2026",
    "BIT Patna fest",
    "BIT Patna technical festival",
    "college fest Bihar",
    "Dev Conquest hackathon",
    "BIT Patna robotics",
    "E-Sports festival Patna",
  ],
  authors: [{ name: "Technika — BIT Patna" }],
  creator: "Technika — BIT Patna",
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
    title: "Technika 2K26 — BIT Patna",
    description:
      "Technology, creativity, and hands-on engineering excellence at BIT Patna.",
    type: "website",
    locale: "en_IN",
    siteName: "Technika 2K26 — BIT Patna",
    images: [
      {
        url: "/images/social-card.jpg",
        width: 1200,
        height: 630,
        alt: "Technika 2K26 — BIT Patna Technical Festival",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/images/social-card.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#0f0c19",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${garamond.variable} ${outfit.variable} ${handwriting.variable} ${harryP.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="restore-house-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: houseBootScript }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <LeafReveal />
        <SiteSchema />
        <HouseProvider>
          <AuthProvider>
            <SmoothScroll>
              <Experience>
                <Header />
                <main id="main-content" tabIndex={-1}>
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
              </Experience>
            </SmoothScroll>
          </AuthProvider>
        </HouseProvider>
      </body>
    </html>
  );
}
