import type { Metadata } from "next";

export const siteName = "Technika ’27";
export const siteDescription = "Technika ’27 is the techno-cultural festival of Birla Institute of Technology, Patna — where technology, creativity, and extraordinary possibilities meet.";
export const socialImage = "/images/social-card.jpg";
export const googleSiteVerification = "o2R9wl2JjVxm9frnLSPwNKWtry-DVPyp9IsaI4pdgjU";

function normalizeOrigin(value?: string) {
  if (!value) return undefined;
  try {
    return new URL(value.startsWith("http") ? value : `https://${value}`).origin;
  } catch {
    return undefined;
  }
}

export const siteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  || normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  || "http://localhost:3000";
export const indexable = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const pageSeo = {
  "/": {
    title: "Technika ’27 — Coming Soon | BIT Patna",
    description: "BIT Patna presents Technika ’27, a wizarding world–inspired techno-cultural festival. The next chapter is being written.",
    label: "Home",
  },
  "/registrations": {
    title: "Technika ’27 Registrations | BIT Patna",
    description: "Prepare for Technika ’27 registrations at BIT Patna. Explore the four competition tracks, participation guidance, FAQs, and registration updates.",
    label: "Registrations",
  },
  "/members": {
    title: "Technika ’27 Organising Team | BIT Patna",
    description: "Meet the organising council, student volunteers, web team, and faculty mentors behind Technika ’27 at Birla Institute of Technology, Patna.",
    label: "Members",
  },
  "/delegate": {
    title: "Technika ’27 College Delegates | BIT Patna",
    description: "Bring your college contingent to Technika ’27 at BIT Patna. Find delegate updates about inter-college participation, passes, accommodation, and campus access.",
    label: "Delegate",
  },
  "/alumni": {
    title: "Technika ’27 Alumni & Memories | BIT Patna",
    description: "Rediscover the Technika community at BIT Patna through alumni stories, festival memories, mentorship opportunities, and the Hall of Legacies.",
    label: "Alumni",
  },
  "/contact": {
    title: "Technika ’27 Contact & Campus | BIT Patna",
    description: "Find BIT Patna campus directions and official enquiry updates for Technika ’27 participants, college delegates, alumni, and festival partners.",
    label: "Contact",
  },
} as const;

export type SitePath = keyof typeof pageSeo;

export function createPageMetadata(path: SitePath): Metadata {
  const page = pageSeo[path];
  const url = absoluteUrl(path);
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName,
      type: "website",
      locale: "en_IN",
      images: [{ url: absoluteUrl(socialImage), width: 1200, height: 630, alt: "Technika ’27 — BIT Patna techno-cultural festival" }],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [absoluteUrl(socialImage)] },
  };
}

export function createPrivatePageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: false, follow: false },
  };
}

export function breadcrumbSchema(path: SitePath) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: absoluteUrl("/") },
      ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: pageSeo[path].label, item: absoluteUrl(path) }]),
    ],
  };
}
