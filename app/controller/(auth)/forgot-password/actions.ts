"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/auth/reset-token";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const RESET_REQUEST_LIMIT = 3;
const RESET_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

export type ForgotPasswordState = {
  submitted: boolean;
  error: string | null;
};

const initialResult: ForgotPasswordState = {
  submitted: false,
  error: null,
};

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const ip = await getClientIp();
  if (isRateLimited(`forgot-password:${ip}`, RESET_REQUEST_LIMIT, RESET_WINDOW_MS)) {
    return {
      ...initialResult,
      error: "Too many requests. Try again in a few minutes.",
    };
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { ...initialResult, error: "Enter a valid email address." };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  // No email sending is configured yet, so the link is only ever logged
  // server-side — never returned to the client. Returning it in the
  // response would let anyone who knows (or guesses) an admin's email
  // address take over that account without ever touching their inbox.
  // Deliberately not confirming/denying whether the email exists in the
  // response either way.
  if (!admin) {
    console.log(
      `[password reset] no admin found for ${parsed.data.email}`,
    );
    return { ...initialResult, submitted: true };
  }

  const token = await createResetToken(admin.id);
  const resetLink = `/controller/reset-password/${token}`;
  console.log(
    `[password reset] link for ${admin.email}: ${resetLink} (valid 1 hour)`,
  );

  return { submitted: true, error: null };
}
