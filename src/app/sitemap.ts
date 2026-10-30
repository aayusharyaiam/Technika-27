import type { MetadataRoute } from "next";
import { pageSeo, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(pageSeo).map((path) => ({
    url: `${siteUrl}${path === "/" ? "/" : path}`,
    lastModified: new Date("2026-10-25T00:00:00+05:30"),
    changeFrequency: path === "/" || path === "/registrations" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/registrations" ? .9 : .7,
    images: path === "/" || path === "/alumni" || path === "/delegate" ? [`${siteUrl}/images/social-card.jpg`] : undefined,
  }));
}
