import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return indexable
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/account",
            "/auth/",
            "/dashboard",
            "/login",
            "/profile",
            "/register",
            "/reset-password",
            "/api/",
          ],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
