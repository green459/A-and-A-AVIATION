import type { Metadata } from "next";
import { getBlog } from "@/lib/data/blogs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ blog: string }>;
}): Promise<Metadata> {
  const { blog: slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.metaTitle || `${post.title} | A&A Aviation`,
    description: post.metaDescription || post.excerpt,
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
