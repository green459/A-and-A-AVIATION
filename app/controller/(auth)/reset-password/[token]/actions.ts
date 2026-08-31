"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { verifyResetToken, consumeResetToken } from "@/lib/auth/reset-token";
import { destroyAllSessionsForAdmin } from "@/lib/auth/session";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordState = { error: string | null };

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const record = await verifyResetToken(parsed.data.token);
  if (!record) {
    return {
      error: "This reset link is invalid or has expired. Request a new one.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.adminUser.update({
    where: { id: record.admin.id },
    data: { passwordHash },
  });
  await consumeResetToken(record.id);
  await destroyAllSessionsForAdmin(record.admin.id);

  redirect("/controller/login?reset=success");
}
