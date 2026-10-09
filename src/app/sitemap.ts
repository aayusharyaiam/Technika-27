import type { MetadataRoute } from "next";
import { absoluteUrl, pageSeo, type SitePath } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(pageSeo) as SitePath[]).map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" || path === "/registrations" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/registrations" ? .9 : .7,
  }));
}
