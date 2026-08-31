import nodemailer, { type Transporter } from "nodemailer";

/** True once SMTP_HOST/SMTP_USER/SMTP_PASSWORD are all set — the minimum
 * needed to authenticate against basically any SMTP provider (Gmail, SES,
 * Mailgun, a company mail server, etc). Callers should check this first and
 * fall back to something else (e.g. a `mailto:` link) when it's false,
 * rather than letting `sendEmail` throw. */
export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
  );
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      // Most providers use STARTTLS on 587 (secure: false, upgraded
      // in-band) rather than implicit TLS on 465 — only flip this on when
      // the provider's docs call for port 465.
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return cachedTransporter;
}

/** Sends a plain-text email via the configured SMTP transport. Throws if
 * `isEmailConfigured()` is false or the send itself fails — callers own
 * deciding what to do when email isn't set up (see `isEmailConfigured`). */
export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASSWORD).");
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  await getTransporter().sendMail({ from, to, subject, text, replyTo });
}
