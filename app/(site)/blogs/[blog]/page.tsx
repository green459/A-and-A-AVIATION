import { notFound } from "next/navigation";
import { getBlog, getBlogs } from "@/lib/data/blogs";
import BlogDetailClient from "./BlogDetailClient";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ blog: string }>;
}) {
  const { blog: slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogs();
  const recentPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const counts = new Map<string, number>();
  for (const p of allPosts) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  const categories = Array.from(counts, ([name, count]) => ({ name, count }));

  return (
    <BlogDetailClient
      post={post}
      recentPosts={recentPosts}
      relatedPosts={relatedPosts}
      categories={categories}
    />
  );
}
