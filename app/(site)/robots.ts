import type { MetadataRoute } from "next";

// Set NEXT_PUBLIC_SITE_URL in production to the real deployed domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aaaviation.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/controller", "/controller/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
