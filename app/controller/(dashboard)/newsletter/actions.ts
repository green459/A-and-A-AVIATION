"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function deleteSubscriber(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.newsletterSubscriber.delete({ where: { id } }).catch(() => {});

  revalidatePath("/controller/newsletter");
}

export async function toggleSubscriberActive(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  const isActive = formData.get("isActive") === "true";
  if (typeof id !== "string" || !id) return;

  await prisma.newsletterSubscriber
    .update({ where: { id }, data: { isActive: !isActive } })
    .catch(() => {});

  revalidatePath("/controller/newsletter");
}
