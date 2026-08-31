"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

const openSchema = z.object({
  id: z.string().min(1),
  inquiryId: z.string().optional(),
});

/** Marks a notification read, then sends the admin to the inquiry it's
 * about (or back to the notifications list if it isn't tied to one). */
export async function openNotification(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = openSchema.safeParse({
    id: formData.get("id"),
    inquiryId: formData.get("inquiryId") || undefined,
  });
  if (!parsed.success) return;

  await prisma.notification
    .update({ where: { id: parsed.data.id }, data: { isRead: true } })
    .catch(() => {});

  revalidatePath("/controller");
  redirect(
    parsed.data.inquiryId
      ? `/controller/inquiries/${parsed.data.inquiryId}`
      : "/controller/notifications",
  );
}

export async function markAllNotificationsRead(): Promise<void> {
  await requireAdmin();

  await prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/controller");
}
