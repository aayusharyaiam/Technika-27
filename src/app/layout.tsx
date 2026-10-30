import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Experience } from "@/components/experience";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { SiteSchema } from "@/components/structured-data";
import { indexable, siteName, siteUrl, socialImage, socialImageAlt } from "@/lib/seo";
import { HouseProvider } from "@/components/house-provider";
import { AuthProvider } from "@/components/auth-provider";
import { SmoothScroll } from "@/components/smoothScroll";
import { getServerSupabase } from "@/lib/supabase/server";
import { Analytics } from "@/components/analytics";
import {
  houseAppleIconFor,
  houseBootScript,
  houseFromValue,
  houseIconFor,
  themeAttributeForHouse,
  type House,
} from "@/lib/houses";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./wizarding.css";
import "./marauders-map.css";
import "./reference-portals.css";
import "./houseThemes.css";
import "./theme-utilities.css";
import "./home-experience.css";

export const dynamic = "force-dynamic";

async function getInitialTheme(): Promise<{ theme: House; fromDatabase: boolean }> {
  const supabase = await getServerSupabase();
  if (!supabase) return { theme: "default", fromDatabase: false };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { theme: "default", fromDatabase: false };

    const { data: profile } = await supabase
      .from("profiles")
      .select("house")
      .eq("id", user.id)
      .maybeSingle();

    return {
      theme:
        houseFromValue(profile?.house) ??
        houseFromValue(user.user_metadata?.house) ??
        "default",
      fromDatabase: true,
    };
  } catch {
    return { theme: "default", fromDatabase: false };
  }
}

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
    default: siteName,
    template: "%s | Technika 2K26",
  },
  description:
    "Step into Technika 2K26, the annual technical festival of BIT Patna. Three days of innovation, creativity, competitions, and extraordinary possibilities. January 16–18, 2026.",
   applicationName: siteName,
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
     title: siteName,
    description:
      "Technology, creativity, and hands-on engineering excellence at BIT Patna.",
    type: "website",
    locale: "en_IN",
     siteName,
    images: [
      {
         url: socialImage,
        width: 1200,
        height: 630,
         alt: socialImageAlt,
      },
    ],
  },
   twitter: { card: "summary_large_image", images: [socialImage], title: siteName, description: "Technology, creativity, and hands-on engineering excellence at BIT Patna." },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { theme, fromDatabase } = await getInitialTheme();
  const icon = houseIconFor(theme);
  const appleIcon = houseAppleIconFor(theme);

  return (
    <html
      lang="en"
      data-house={theme}
      data-theme={themeAttributeForHouse(theme)}
      className={`${garamond.variable} ${outfit.variable} ${handwriting.variable} ${harryP.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          href={`${icon}?house=${theme}`}
          type={icon.endsWith(".svg") ? "image/svg+xml" : "image/png"}
        />
        <link
          rel="apple-touch-icon"
          href={`${appleIcon}?house=${theme}`}
          type="image/png"
        />
        <Script
          id="restore-house-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: houseBootScript(theme, fromDatabase),
          }}
        />
      </head>
      <body className="theme-page transition-colors duration-500">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteSchema />
        <Analytics />
        <HouseProvider initialHouse={theme} preferInitialHouse={fromDatabase}>
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
