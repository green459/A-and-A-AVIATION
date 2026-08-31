"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { SEO_PAGES } from "@/lib/data/seo";

const seoSchema = z.object({
  path: z.string().refine((p) => SEO_PAGES.some((page) => page.path === p)),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  noindex: z.boolean().default(false),
});

export type SeoFormState = { error: string | null; success: boolean };

export async function updateSeoMeta(
  _prevState: SeoFormState,
  formData: FormData,
): Promise<SeoFormState> {
  await requireAdmin();

  const parsed = seoSchema.safeParse({
    path: formData.get("path"),
    title: formData.get("title"),
    description: formData.get("description"),
    noindex: formData.get("noindex") === "on",
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
      success: false,
    };
  }

  await prisma.seoMeta.upsert({
    where: { path: parsed.data.path },
    create: parsed.data,
    update: {
      title: parsed.data.title,
      description: parsed.data.description,
      noindex: parsed.data.noindex,
    },
  });

  revalidatePath(parsed.data.path === "/" ? "/" : parsed.data.path);
  return { error: null, success: true };
}
