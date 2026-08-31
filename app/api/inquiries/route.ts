import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(200, "That name is too long."),
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
  phone: z.string().trim().max(50, "That phone number is too long.").optional(),
  serviceCategory: z.string().trim().max(120).optional(),
  message: z.string().trim().max(5000, "That message is too long.").optional(),
  // Honeypot — real visitors never fill this in; bots typically do.
  company: z.string().max(0).optional(),
  // Optional: the Turnstile widget is currently disabled on the client (see
  // components/Contact.tsx), so this rarely arrives — verified below only
  // when present, so re-enabling the widget later needs no server change.
  "cf-turnstile-response": z.string().optional(),
});

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Verifies a Turnstile token server-side. Skips (with a warning) when no
 * secret key is configured, so local dev without a .env isn't blocked —
 * production must set TURNSTILE_SECRET_KEY. */
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[inquiries] TURNSTILE_SECRET_KEY not set — skipping captcha verification.");
    return true;
  }

  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
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

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    // Field-level messages (name/email/phone/message) so the form can show
    // them inline next to the field that actually failed, instead of one
    // generic "Invalid form data." banner with no context.
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success so the bot doesn't learn anything.
  if (parsed.data.company) {
    return NextResponse.json({ success: true });
  }

  const turnstileToken = parsed.data["cf-turnstile-response"];
  if (turnstileToken) {
    const captchaOk = await verifyTurnstile(turnstileToken, ip);
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
    }
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      serviceCategory: parsed.data.serviceCategory || undefined,
      message: parsed.data.message || undefined,
      source: "contact_page",
    },
  });

  // Notification failures shouldn't fail the contact form submission itself.
  await prisma.notification
    .create({
      data: {
        type: "NEW_INQUIRY",
        message: `New inquiry from ${inquiry.name}${
          inquiry.serviceCategory ? ` — ${inquiry.serviceCategory}` : ""
        }`,
        inquiryId: inquiry.id,
      },
    })
    .catch(() => {});

  return NextResponse.json({ success: true });
}
