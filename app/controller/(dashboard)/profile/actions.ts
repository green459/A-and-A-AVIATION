"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, destroyAllSessionsForAdmin } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
});

export type ProfileState = { error: string | null; success: boolean };

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const admin = await requireAdmin();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
      success: false,
    };
  }

  const { name, email } = parsed.data;

  if (email !== admin.email) {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return { error: "That email is already in use.", success: false };
    }
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { name, email },
  });

  revalidatePath("/controller/profile");
  return { error: null, success: true };
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordState = { error: string | null };

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const admin = await requireAdmin();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const currentOk = await verifyPassword(
    parsed.data.currentPassword,
    admin.passwordHash,
  );
  if (!currentOk) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  // Changing the password invalidates every session, including this one —
  // same posture as a forgot-password reset.
  await destroyAllSessionsForAdmin(admin.id);
  redirect("/controller/login?reset=success");
}
