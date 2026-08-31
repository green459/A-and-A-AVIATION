import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export interface SeoMetaValues {
  title: string;
  description: string;
  noindex: boolean;
}

/** Static pages the admin SEO page can manage — path is the SeoMeta key.
 * `fallback` is what the page uses when no SeoMeta row exists yet, and also
 * what the admin SEO page pre-fills the form with, so the two never drift. */
export const SEO_PAGES: {
  path: string;
  label: string;
  fallback: SeoMetaValues;
}[] = [
  {
    path: "/",
    label: "Homepage",
    fallback: {
      title: "A&A Aviation — Global Travel & Visa Solutions",
      description:
        "Professional travel and visa services — air ticketing, visa processing, hotel reservations and more.",
      noindex: false,
    },
  },
  {
    path: "/about",
    label: "About Us",
    fallback: {
      title: "About Us",
      description:
        "A Dhaka-based travel and visa agency helping clients fly, study, work and reunite with family abroad — learn who we are and how we work.",
      noindex: false,
    },
  },
  {
    path: "/services",
    label: "Services (listing)",
    fallback: {
      title: "Our Services",
      description:
        "Flights, hotels, visas and document services — everything you need for a hassle-free international journey.",
      noindex: false,
    },
  },
  {
    path: "/destinations",
    label: "Destinations",
    fallback: {
      title: "Destinations",
      description:
        "Visa and travel support across our clients' most requested destinations — from Portugal and the UK to the UAE and Saudi Arabia.",
      noindex: false,
    },
  },
  {
    path: "/blogs",
    label: "Travel Guide (listing)",
    fallback: {
      title: "Travel Guide",
      description:
        "Visa guides, booking tips, and travel know-how from the A&A Aviation team.",
      noindex: false,
    },
  },
  {
    path: "/contact",
    label: "Contact Us",
    fallback: {
      title: "Contact Us",
      description:
        "Get in touch with A&A Aviation for travel, visa and flight booking support — call, email or send us a message.",
      noindex: false,
    },
  },
  {
    path: "/privacy-policy",
    label: "Privacy Policy",
    fallback: {
      title: "Privacy Policy",
      description:
        "How A&A Aviation collects, uses and protects the information you share through our contact form, newsletter and website.",
      noindex: false,
    },
  },
  {
    path: "/terms-and-conditions",
    label: "Terms & Conditions",
    fallback: {
      title: "Terms & Conditions",
      description:
        "The terms that govern your use of the A&A Aviation website and our travel, visa and related services.",
      noindex: false,
    },
  },
  {
    path: "/refund-policy",
    label: "Refund Policy",
    fallback: {
      title: "Refund Policy",
      description:
        "How cancellations and refunds are handled for flights, visa processing, hotel reservations and other A&A Aviation services.",
      noindex: false,
    },
  },
];

export function getSeoFallback(path: string): SeoMetaValues {
  return (
    SEO_PAGES.find((p) => p.path === path)?.fallback ?? {
      title: "A&A Aviation",
      description: "",
      noindex: false,
    }
  );
}

export async function getSeoMeta(
  path: string,
  fallback: SeoMetaValues,
): Promise<SeoMetaValues> {
  const row = await prisma.seoMeta.findUnique({ where: { path } });
  if (!row) return fallback;
  return {
    title: row.title,
    description: row.description,
    noindex: row.noindex,
  };
}

export async function getAllSeoMeta(): Promise<Map<string, SeoMetaValues>> {
  const rows = await prisma.seoMeta.findMany();
  return new Map(
    rows.map((row) => [
      row.path,
      { title: row.title, description: row.description, noindex: row.noindex },
    ]),
  );
}

export function toMetadata(seo: SeoMetaValues): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
  };
}
