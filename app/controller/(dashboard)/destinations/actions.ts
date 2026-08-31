"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { saveUploadedImage } from "@/lib/upload";
import { slugify } from "@/lib/slug";

const destinationSchema = z.object({
  country: z.string().trim().min(1, "Country is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  region: z.string().trim().min(1, "Region is required."),
  tagline: z.string().trim().min(1, "Tagline is required."),
  description: z.string().trim().min(1, "Description is required."),
  popularFor: z.array(z.string().trim().min(1)).min(1, "Add at least one tag."),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().trim().optional().transform((v) => v || null),
  metaDescription: z.string().trim().optional().transform((v) => v || null),
});

function parseDestinationForm(formData: FormData) {
  const country = String(formData.get("country") ?? "");
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const popularFor = formData
    .getAll("popularFor")
    .map((v) => String(v).trim())
    .filter(Boolean);

  return destinationSchema.safeParse({
    country,
    slug: rawSlug || slugify(country),
    region: formData.get("region"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    popularFor,
    order: formData.get("order") || 0,
    isPublished: formData.get("isPublished") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
  });
}

export type DestinationFormState = { error: string | null };

export async function createDestination(
  _prevState: DestinationFormState,
  formData: FormData,
): Promise<DestinationFormState> {
  await requireAdmin();

  const parsed = parseDestinationForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.destination.findUnique({
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
    imagePath = await saveUploadedImage(imageFile, "destinations");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  await prisma.destination.create({
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/controller/destinations");
  revalidatePath("/destinations");
  redirect("/controller/destinations");
}

export async function updateDestination(
  id: string,
  _prevState: DestinationFormState,
  formData: FormData,
): Promise<DestinationFormState> {
  await requireAdmin();

  const parsed = parseDestinationForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Destination not found." };
  }

  if (parsed.data.slug !== existing.slug) {
    const slugTaken = await prisma.destination.findUnique({
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
      imagePath = await saveUploadedImage(imageFile, "destinations");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed." };
    }
  }

  await prisma.destination.update({
    where: { id },
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/controller/destinations");
  revalidatePath("/destinations");
  redirect("/controller/destinations");
}

export async function deleteDestination(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.destination.delete({ where: { id } }).catch(() => {});

  revalidatePath("/controller/destinations");
  revalidatePath("/destinations");
}
