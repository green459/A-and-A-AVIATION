import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "../../BlogForm";
import { updateBlog } from "../../actions";

export const metadata = { title: "Edit blog post" };

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blog.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Edit blog post</h1>
      <p className="mt-1 text-sm text-gray-500">{post.title}</p>
      <div className="mt-6">
        <BlogForm
          action={updateBlog.bind(null, id)}
          defaultValues={{
            title: post.title,
            slug: post.slug,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            highlights: post.highlights as string[],
            image: post.image,
            publishedAt: post.publishedAt.toISOString().slice(0, 10),
            isPublished: post.isPublished,
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
