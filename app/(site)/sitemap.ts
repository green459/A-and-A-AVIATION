import type { MetadataRoute } from "next";
import { getServices } from "@/lib/data/services";
import { getBlogs } from "@/lib/data/blogs";
import { getTermsConditions, getRefundPolicy } from "@/lib/data/settings";

// Set NEXT_PUBLIC_SITE_URL in production to the real deployed domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aaaviation.com";

// // Queries the DB directly, so it needs the same force-dynamic treatment as
// // app/(site)/layout.tsx (see comment there) — this file sits alongside that
// // layout rather than under it, so it doesn't inherit the config.
// export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, blogPosts, terms, refund] = await Promise.all([
    getServices(),
    getBlogs(),
    getTermsConditions(),
    getRefundPolicy(),
  ]);
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "yearly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${siteUrl}/destinations`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${siteUrl}/blogs`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...(terms.enabled
      ? [
          {
            url: `${siteUrl}/terms-and-conditions`,
            changeFrequency: "yearly" as const,
            priority: 0.2,
          },
        ]
      : []),
    ...(refund.enabled
      ? [
          {
            url: `${siteUrl}/refund-policy`,
            changeFrequency: "yearly" as const,
            priority: 0.2,
          },
        ]
      : []),
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blogs/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
