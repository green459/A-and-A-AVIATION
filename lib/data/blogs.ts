import { prisma } from "@/lib/prisma";
import type { Blog } from "@/lib/generated/prisma/client";

export interface PublicBlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  /** Sanitized rich-text HTML from the admin editor — render with
   * dangerouslySetInnerHTML inside a `.prose` container. */
  content: string;
  highlights: string[];
  metaTitle: string | null;
  metaDescription: string | null;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toPublicBlogPost(row: Blog): PublicBlogPost {
  return {
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    date: formatDate(row.publishedAt),
    image: row.image,
    content: row.content,
    highlights: row.highlights as string[],
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  };
}

export async function getBlogs(): Promise<PublicBlogPost[]> {
  const rows = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toPublicBlogPost);
}

export async function getBlog(slug: string): Promise<PublicBlogPost | null> {
  const row = await prisma.blog.findFirst({
    where: { slug, isPublished: true },
  });
  return row ? toPublicBlogPost(row) : null;
}
