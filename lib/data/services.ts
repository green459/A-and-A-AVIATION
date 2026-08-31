import { prisma } from "@/lib/prisma";
import type { Service } from "@/lib/generated/prisma/client";

export interface PublicService {
  slug: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

function toPublicService(row: Service): PublicService {
  return {
    slug: row.slug,
    category: row.category,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    features: row.features as string[],
    image: row.image,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  };
}

export async function getServices(): Promise<PublicService[]> {
  const rows = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return rows.map(toPublicService);
}

export async function getService(slug: string): Promise<PublicService | null> {
  const row = await prisma.service.findFirst({
    where: { slug, isPublished: true },
  });
  return row ? toPublicService(row) : null;
}

const DEFAULT_SERVICE_CATEGORIES = [
  "Air Ticketing",
  "Tourist Visa",
  "Work & Family Visa",
  "Hotel Booking",
  "Document Legalization",
];

/** Distinct categories across published services, for the contact form's
 * dropdown — falls back to a sensible default list before any services
 * exist. Always ends with "Other" for anything that doesn't fit. */
export async function getServiceCategories(): Promise<string[]> {
  const rows = await prisma.service.findMany({
    where: { isPublished: true },
    distinct: ["category"],
    select: { category: true },
    orderBy: { order: "asc" },
  });
  const categories = rows.map((r) => r.category).filter(Boolean);
  return [...(categories.length > 0 ? categories : DEFAULT_SERVICE_CATEGORIES), "Other"];
}
