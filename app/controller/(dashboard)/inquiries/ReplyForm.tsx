"use client";

import { useActionState, useEffect, useRef } from "react";
import { Mail, Send } from "lucide-react";
import { replyToInquiry, type ReplyState } from "./actions";

const initialState: ReplyState = { status: "idle", error: null };

export default function ReplyForm({
  inquiryId,
  emailConfigured,
}: {
  inquiryId: string;
  emailConfigured: boolean;
}) {
  const [state, formAction, pending] = useActionState(replyToInquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // No SMTP configured — the action still saves the reply, then hands back
  // a mailto: link for us to open in the admin's own mail app instead of
  // sending it server-side.
  useEffect(() => {
    if (state.status === "opened-mailto" && state.mailtoHref) {
      window.location.href = state.mailtoHref;
      formRef.current?.reset();
    } else if (state.status === "sent-email") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={inquiryId} />

      <div className="flex items-center gap-2 text-xs text-gray-500">
        {emailConfigured ? (
          <>
            <Mail className="h-3.5 w-3.5 text-teal" />
            Sends straight to the inquirer&apos;s inbox via the configured SMTP account.
          </>
        ) : (
          <>
            <Mail className="h-3.5 w-3.5 text-amber-500" />
            No SMTP configured — this saves the reply here, then opens it in your
            own mail app to send.
          </>
        )}
      </div>

      <textarea
        name="message"
        rows={5}
        required
        placeholder="Write your reply…"
        className="min-h-32 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
      />

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.status === "sent-email" && (
        <p role="status" className="rounded-lg bg-teal/10 px-4 py-3 text-sm text-navy">
          Reply sent.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {pending ? "Sending…" : emailConfigured ? "Send reply" : "Save & open mail app"}
      </button>
    </form>
  );
}
