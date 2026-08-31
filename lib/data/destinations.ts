import { prisma } from "@/lib/prisma";
import type { Destination } from "@/lib/generated/prisma/client";

export interface PublicDestination {
  slug: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  popularFor: string[];
  image: string;
}

function toPublicDestination(row: Destination): PublicDestination {
  return {
    slug: row.slug,
    country: row.country,
    region: row.region,
    tagline: row.tagline,
    description: row.description,
    popularFor: row.popularFor as string[],
    image: row.image,
  };
}

export async function getDestinations(): Promise<PublicDestination[]> {
  const rows = await prisma.destination.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return rows.map(toPublicDestination);
}
