"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { getContactInfo } from "@/lib/data/settings";

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
});

export async function updateInquiryStatus(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await prisma.inquiry
    .update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    })
    .catch(() => {});

  revalidatePath("/controller/inquiries");
  revalidatePath(`/controller/inquiries/${parsed.data.id}`);
}

const notesSchema = z.object({
  id: z.string().min(1),
  notes: z.string().trim().max(5000, "Notes are limited to 5000 characters.").optional(),
});

export type NotesState = { status: "idle" | "success" | "error"; error: string | null };

export async function updateInquiryNotes(
  _prevState: NotesState,
  formData: FormData,
): Promise<NotesState> {
  await requireAdmin();

  const parsed = notesSchema.safeParse({
    id: formData.get("id"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Couldn't save notes.",
    };
  }

  try {
    await prisma.inquiry.update({
      where: { id: parsed.data.id },
      data: { notes: parsed.data.notes || null },
    });
  } catch {
    return {
      status: "error",
      error: "Couldn't save notes — the inquiry may have been deleted.",
    };
  }

  revalidatePath("/controller/inquiries");
  revalidatePath(`/controller/inquiries/${parsed.data.id}`);
  return { status: "success", error: null };
}

/** Fire-and-forget from the client when a detail view/modal opens — not a
 * form action, just a plain server function called directly. */
export async function markInquiryRead(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;

  await prisma.inquiry
    .update({ where: { id }, data: { isRead: true } })
    .catch(() => {});

  revalidatePath("/controller/inquiries");
}

export async function deleteInquiry(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.inquiry.delete({ where: { id } }).catch(() => {});

  revalidatePath("/controller/inquiries");
  redirect("/controller/inquiries");
}

const replySchema = z.object({
  id: z.string().min(1),
  message: z.string().trim().min(1, "Write a reply first.").max(5000),
});

export type ReplyState = {
  status: "idle" | "sent-email" | "opened-mailto";
  error: string | null;
  mailtoHref?: string;
};

/** Sends the admin's reply straight to the inquirer over SMTP when it's
 * configured (see lib/email.ts); otherwise the reply is still saved here for
 * the record, and the caller gets back a `mailto:` link pre-filled with the
 * same subject/body to open in the admin's own mail app instead. Either way
 * a NEW inquiry moves to IN_PROGRESS, since a reply means someone's actively
 * on it. */
export async function replyToInquiry(
  _prevState: ReplyState,
  formData: FormData,
): Promise<ReplyState> {
  await requireAdmin();

  const parsed = replySchema.safeParse({
    id: formData.get("id"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "idle",
      error: parsed.error.issues[0]?.message ?? "Enter a reply message.",
    };
  }
  const { id, message } = parsed.data;

  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) {
    return { status: "idle", error: "This inquiry no longer exists." };
  }

  const contact = await getContactInfo();
  const subject = `Re: Your inquiry to A&A Aviation${
    inquiry.serviceCategory ? ` — ${inquiry.serviceCategory}` : ""
  }`;

  const emailConfigured = isEmailConfigured();
  if (emailConfigured) {
    try {
      await sendEmail({ to: inquiry.email, subject, text: message, replyTo: contact.email });
    } catch {
      return {
        status: "idle",
        error: "Couldn't send the email — check the SMTP settings and try again.",
      };
    }
  }

  await prisma.inquiryReply.create({
    data: { inquiryId: id, message, method: emailConfigured ? "email" : "mailto" },
  });
  if (inquiry.status === "NEW") {
    await prisma.inquiry.update({ where: { id }, data: { status: "IN_PROGRESS" } });
  }

  revalidatePath(`/controller/inquiries/${id}`);
  revalidatePath("/controller/inquiries");

  if (emailConfigured) {
    return { status: "sent-email", error: null };
  }

  const mailtoHref = `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(message)}`;
  return { status: "opened-mailto", error: null, mailtoHref };
}
