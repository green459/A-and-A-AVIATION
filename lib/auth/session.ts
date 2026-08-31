import { cookies } from "next/headers";
import { randomBytes, createHash } from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import type { AdminUser } from "@/lib/generated/prisma/client";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a DB-backed session and sets the session cookie on the response. */
export async function createSession(
  adminId: string,
  userAgent?: string | null,
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      adminId,
      userAgent: userAgent ?? undefined,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Reads and validates the current session cookie against the DB. */
export async function getSession(): Promise<{ admin: AdminUser } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { admin: true },
  });

  if (!session || session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  return { admin: session.admin };
}

/** Use at the top of any protected server component/action. Redirects if not logged in. */
export async function requireAdmin(): Promise<AdminUser> {
  const session = await getSession();
  if (!session) {
    redirect("/controller/login");
  }
  return session.admin;
}

/** Clears the current session, both in the DB and the browser cookie. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => {});
  }
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    path: "/",
    expires: new Date(0),
  });
}

/** Invalidates every session for an admin — used after a password reset. */
export async function destroyAllSessionsForAdmin(
  adminId: string,
): Promise<void> {
  await prisma.session.deleteMany({ where: { adminId } });
}
