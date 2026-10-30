import type { Metadata } from "next";

const origin = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const siteUrl = new URL(origin).origin;
export const indexable = process.env.VERCEL_ENV !== "preview";
export const siteName = "Technika 2K26 — BIT Patna";
export const socialImage = "/images/social-card.jpg";
export const socialImageAlt = "Technika 2K26 — BIT Patna technical festival at the crossroads of technology and creativity";

export const pageSeo = {
  "/": {
    title: "Technika 2K26 — BIT Patna Technical Festival",
    description: "Discover Technika 2K26, BIT Patna’s annual technical festival. Explore Dev Conquest, coding contests, robotics, E-Sports, cultural experiences, and a 5 Lakhs+ prize pool.",
    label: "Home",
  },
  "/marauders-map": {
    title: "The Marauder’s Map — Technika ’27 Event Explorer",
    description: "Explore Technika ’27 events on an illustrative Marauder’s Map. Search the event directory, save your quests, and follow official campus routes when venue data is confirmed.",
    label: "Marauder’s Map",
  },
  "/events": { title: "Event Registry — Technika ’27", description: "Explore the future event chambers of Technika ’27. Official event information will be published here when confirmed.", label: "Events" },
  "/technical": { title: "Technical Chamber — Technika ’27", description: "The technical event chamber for Technika ’27 is being prepared. Official challenges, rules, and registration details will appear here when confirmed.", label: "Technical" },
  "/cultural": { title: "Cultural Chamber — Technika ’27", description: "The cultural event chamber for Technika ’27 is being prepared. Official programme information will appear here when confirmed.", label: "Cultural" },
  "/art-craft": { title: "Art & Craft Chamber — Technika ’27", description: "The art and craft chamber for Technika ’27 is being prepared. Official briefs and entry details will appear here when confirmed.", label: "Art & Craft" },
  "/frame-focus": { title: "Frame & Focus Chamber — Technika ’27", description: "The visual event chamber for Technika ’27 is being prepared. Official briefs and submission details will appear here when confirmed.", label: "Frame & Focus" },
  "/esports": { title: "E-sports Chamber — Technika ’27", description: "The e-sports event chamber for Technika ’27 is being prepared. Official games, rules, and registration details will appear here when confirmed.", label: "E-sports" },
  "/merchandise": { title: "Festival Merchandise — Technika ’27", description: "The official Technika ’27 merchandise catalogue is being prepared. Product and ordering information will appear here when confirmed.", label: "Merchandise" },
  "/core": { title: "Organising Council — Technika ’27", description: "The official organising council directory for Technika ’27 will be revealed here when the roster is confirmed.", label: "Core Team" },
  "/devs": { title: "Web Sorcerers — Technika ’27", description: "The official Technika ’27 developers directory will be revealed here when credits and roles are confirmed.", label: "Developers" },
  "/timeline": { title: "Programme Timeline — Technika ’27", description: "The official Technika ’27 programme timeline will appear here when dates, sessions, and venues are confirmed.", label: "Timeline" },
  "/event-timeline": { title: "Live Event Timeline — Technika ’27", description: "The live Technika ’27 programme view will be enabled here when the official schedule feed exists.", label: "Live Timeline" },
  "/accommodation": { title: "Guest Quarters — Technika ’27", description: "Official Technika ’27 accommodation information will appear here when arrangements are confirmed.", label: "Accommodation" },
  "/registrations": {
    title: "Registrations & Event Passes — The Sorting Ceremony",
    description: "Prepare for Technika ’27 registrations at BIT Patna. Discover the four house tracks, read participation FAQs, and save the provisional festival dates. Registrations open soon.",
    label: "Registrations",
  },
  "/members": {
    title: "Organising Team — The Order of Technika",
    description: "Meet the organising council, web team, faculty mentors, and volunteers behind Technika ’27 at BIT Patna. The Order of Technika roster will be revealed soon.",
    label: "Members",
  },
  "/delegate": {
    title: "College Delegates & Contingents — Triwizard Conclave",
    description: "Bring your college contingent to Technika ’27 at BIT Patna. Explore the Triwizard Delegate Conclave and upcoming information on passes, accommodation, and inter-college participation.",
    label: "Delegate",
  },
  "/alumni": {
    title: "Alumni & Festival Memories — The Hall of Legacies",
    description: "Rediscover the Technika community at BIT Patna. Explore the Hall of Legacies, upcoming alumni reunions, mentorship opportunities, and the festival’s Pensieve archives.",
    label: "Alumni",
  },
  "/contact": {
    title: "Contact & Campus Directions — The Owlery",
    description: "Contact the Technika ’27 team at BIT Patna for participant, delegate, alumni, partnership, and campus enquiries through the official Owlery.",
    label: "Contact",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Read the Technika 2K26 privacy policy for website, account, contact, and analytics data.",
    label: "Privacy Policy",
  },
  "/delegate-registration": {
    title: "Delegate Registration — Technika ’27",
    description: "Prepare your college delegation for Technika ’27 at BIT Patna. Delegate registration details will be published when the official portal opens.",
    label: "Delegate Registration",
  },
  "/delegate-group-registration": {
    title: "Group Delegate Registration — Technika ’27",
    description: "Bring your full college contingent to Technika ’27 at BIT Patna. Group registration details will be announced with the delegate portal.",
    label: "Group Registration",
  },
} as const;

export type SitePath = keyof typeof pageSeo;

export function createPageMetadata(path: SitePath): Metadata {
  const page = pageSeo[path];
  const title = path === "/" ? page.title : `${page.title} | Technika 2K26`;
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: `${siteUrl}${path === "/" ? "/" : path}` },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      title, description: page.description, url: `${siteUrl}${path === "/" ? "/" : path}`, siteName,
      type: "website", locale: "en_IN",
      images: [{ url: socialImage, width: 1200, height: 630, alt: socialImageAlt }],
    },
    twitter: { card: "summary_large_image", title, description: page.description, images: [socialImage] },
  };
}

export function createPrivateMetadata(title: string, description: string, path?: string): Metadata {
  return {
    title,
    description,
    ...(path ? { alternates: { canonical: `${siteUrl}${path}` } } : {}),
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: { title, description, url: path ? `${siteUrl}${path}` : siteUrl, siteName, type: "website", images: [{ url: socialImage, width: 1200, height: 630, alt: socialImageAlt }] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

export function breadcrumbSchema(path: SitePath) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: `${siteUrl}/` },
      ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: pageSeo[path].label, item: `${siteUrl}${path}` }]),
    ],
  };
}
