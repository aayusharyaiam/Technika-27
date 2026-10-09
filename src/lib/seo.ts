import type { Metadata } from "next";

const origin = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const siteUrl = new URL(origin).origin;
export const indexable = process.env.VERCEL_ENV !== "preview";

export const pageSeo = {
  "/": {
    title: "Technika ’27 — Coming Soon | BIT Patna",
    description: "BIT Patna presents Technika ’27, a wizarding world–inspired techno-cultural festival. The next chapter is being written.",
    label: "Home",
  },
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
    description: "Find BIT Patna campus directions and upcoming official enquiry channels for Technika ’27. The Owlery will connect participants, college delegates, and festival partners soon.",
    label: "Contact",
  },
} as const;

export type SitePath = keyof typeof pageSeo;

export function createPageMetadata(path: SitePath): Metadata {
  const page = pageSeo[path];
  const title = path === "/" ? page.title : `${page.title} | Technika ’27`;
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title, description: page.description, url: path, siteName: "Technika ’27 — BIT Patna",
      type: "website", locale: "en_IN",
      images: [{ url: "/images/social-card.jpg", width: 1200, height: 630, alt: "Technika 27 — BIT Patna, The Triwizard Tech Odyssey" }],
    },
    twitter: { card: "summary_large_image", title, description: page.description, images: ["/images/social-card.jpg"] },
  };
}

export function breadcrumbSchema(path: SitePath) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Technika ’27", item: `${siteUrl}/` },
      ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: pageSeo[path].label, item: `${siteUrl}${path}` }]),
    ],
  };
}
