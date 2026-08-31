import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import type { AdminUser } from "@/lib/generated/prisma/client";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a one-hour, single-use reset token. Returns the raw token for the link. */
export async function createResetToken(adminId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: { tokenHash: hashToken(token), adminId, expiresAt },
  });

  return token;
}

/** Validates a raw token from the URL. Does not consume it. */
export async function verifyResetToken(
  rawToken: string,
): Promise<{ id: string; admin: AdminUser } | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { admin: true },
  });

  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return null;
  }

  return { id: record.id, admin: record.admin };
}

/** Marks a reset token used. Call once the new password has been saved. */
export async function consumeResetToken(tokenId: string): Promise<void> {
  await prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { usedAt: new Date() },
  });
}
