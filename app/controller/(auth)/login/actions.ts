"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const LOGIN_ATTEMPT_LIMIT = 8;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  next: z.string().optional(),
});

export type LoginState = { error: string | null };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = await getClientIp();
  if (isRateLimited(`login:${ip}`, LOGIN_ATTEMPT_LIMIT, LOGIN_WINDOW_MS)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const { email, password, next } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  const passwordOk = admin
    ? await verifyPassword(password, admin.passwordHash)
    : false;

  if (!admin || !passwordOk) {
    return { error: "Incorrect email or password." };
  }

  const userAgent = (await headers()).get("user-agent");
  await createSession(admin.id, userAgent);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const destination =
    next && next.startsWith("/controller") ? next : "/controller";
  redirect(destination);
}
