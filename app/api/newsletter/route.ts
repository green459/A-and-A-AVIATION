import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

const newsletterSchema = z.object({
  email: z.string().trim().email(),
  // Honeypot — real visitors never fill this in; bots typically do.
  company: z.string().max(0).optional(),
});

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(`newsletter:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // Honeypot tripped — pretend success so the bot doesn't learn anything.
  if (parsed.data.company) {
    return NextResponse.json({ success: true });
  }

  const { email } = parsed.data;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) {
    if (!existing.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });
    }
    // Already subscribed (or just resubscribed) — treat both the same from
    // the visitor's side so this endpoint can't be used to probe which
    // emails are already on the list.
    return NextResponse.json({ success: true });
  }

  const subscriber = await prisma.newsletterSubscriber.create({
    data: { email, source: "footer" },
  });

  await prisma.notification
    .create({
      data: {
        type: "NEW_SUBSCRIBER",
        message: `New newsletter subscriber: ${subscriber.email}`,
      },
    })
    .catch(() => {});

  return NextResponse.json({ success: true });
}
