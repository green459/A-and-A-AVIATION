"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { saveUploadedImage } from "@/lib/upload";
import { slugify } from "@/lib/slug";

const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  category: z.string().trim().min(1, "Category is required."),
  tagline: z.string().trim().min(1, "Tagline is required."),
  description: z.string().trim().min(1, "Description is required."),
  features: z.array(z.string().trim().min(1)).min(1, "Add at least one feature."),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().trim().optional().transform((v) => v || null),
  metaDescription: z.string().trim().optional().transform((v) => v || null),
});

function parseServiceForm(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const features = formData
    .getAll("features")
    .map((v) => String(v).trim())
    .filter(Boolean);

  return serviceSchema.safeParse({
    title,
    slug: rawSlug || slugify(title),
    category: formData.get("category"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    features,
    order: formData.get("order") || 0,
    isPublished: formData.get("isPublished") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
  });
}

export type ServiceFormState = { error: string | null };

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  await requireAdmin();

  const parsed = parseServiceForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.service.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { error: "That slug is already in use." };
  }

  const imageFile = formData.get("image");
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return { error: "An image is required." };
  }

  let imagePath: string;
  try {
    imagePath = await saveUploadedImage(imageFile, "services");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  await prisma.service.create({
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/controller/services");
  revalidatePath("/services");
  redirect("/controller/services");
}

export async function updateService(
  id: string,
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  await requireAdmin();

  const parsed = parseServiceForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Service not found." };
  }

  if (parsed.data.slug !== existing.slug) {
    const slugTaken = await prisma.service.findUnique({
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
      imagePath = await saveUploadedImage(imageFile, "services");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed." };
    }
  }

  await prisma.service.update({
    where: { id },
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/controller/services");
  revalidatePath(`/services/${parsed.data.slug}`);
  revalidatePath("/services");
  redirect("/controller/services");
}

export async function deleteService(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.service.delete({ where: { id } }).catch(() => {});

  revalidatePath("/controller/services");
  revalidatePath("/services");
}
