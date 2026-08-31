"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { saveUploadedImage } from "@/lib/upload";
import { slugify } from "@/lib/slug";
import { sanitizeRichText } from "@/lib/sanitize";

const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  category: z.string().trim().min(1, "Category is required."),
  excerpt: z.string().trim().min(1, "Excerpt is required."),
  content: z.string().trim().min(1, "Write something in the body."),
  highlights: z.array(z.string().trim().min(1)).min(1, "Add at least one takeaway."),
  publishedAt: z.coerce.date(),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().trim().optional().transform((v) => v || null),
  metaDescription: z.string().trim().optional().transform((v) => v || null),
});

function parseBlogForm(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const content = sanitizeRichText(String(formData.get("content") ?? ""));
  const highlights = formData
    .getAll("highlights")
    .map((v) => String(v).trim())
    .filter(Boolean);
  const publishedAtRaw = String(formData.get("publishedAt") ?? "");

  return blogSchema.safeParse({
    title,
    slug: rawSlug || slugify(title),
    category: formData.get("category"),
    excerpt: formData.get("excerpt"),
    content,
    highlights,
    publishedAt: publishedAtRaw || new Date().toISOString(),
    isPublished: formData.get("isPublished") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
  });
}

export type BlogFormState = { error: string | null };

export async function createBlog(
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireAdmin();

  const parsed = parseBlogForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.blog.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { error: "That slug is already in use." };
  }

  const imageFile = formData.get("image");
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return { error: "A cover image is required." };
  }

  let imagePath: string;
  try {
    imagePath = await saveUploadedImage(imageFile, "blogs");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  await prisma.blog.create({
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/controller/blogs");
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/controller/blogs");
}

export async function updateBlog(
  id: string,
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireAdmin();

  const parsed = parseBlogForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Blog post not found." };
  }

  if (parsed.data.slug !== existing.slug) {
    const slugTaken = await prisma.blog.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (slugTaken) {
      return { error: "That slug is already in use." };
    }
  }

  let imagePath = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imagePath = await saveUploadedImage(imageFile, "blogs");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed." };
    }
  }

  await prisma.blog.update({
    where: { id },
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/controller/blogs");
  revalidatePath(`/blogs/${parsed.data.slug}`);
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/controller/blogs");
}

export async function deleteBlog(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.blog.delete({ where: { id } }).catch(() => {});

  revalidatePath("/controller/blogs");
  revalidatePath("/blogs");
  revalidatePath("/");
}

/** Called directly from RichTextEditor's image button (a plain async call,
 * not a form submit) to upload an in-body image and return its URL. */
export async function uploadEditorImage(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided." };
  }

  try {
    const url = await saveUploadedImage(file, "blog-content");
    return { url };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Image upload failed.",
    };
  }
}
