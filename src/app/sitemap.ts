import type { MetadataRoute } from "next";
import { pageSeo, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(pageSeo).map((path) => ({
    url: `${siteUrl}${path === "/" ? "/" : path}`,
    changeFrequency: path === "/" || path === "/registrations" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/registrations" ? .9 : .7,
  }));
}
