import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return indexable
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/account", "/dashboard", "/login", "/signup", "/reset-password", "/sorting", "/profile", "/auth/"] }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl }
    : { rules: { userAgent: "*", disallow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
