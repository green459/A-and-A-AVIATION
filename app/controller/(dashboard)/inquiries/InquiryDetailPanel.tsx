"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Inquiry, InquiryReply } from "@/lib/generated/prisma/client";
import { Select } from "../_components/FormField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import ConfirmDialog from "../_components/ConfirmDialog";
import StatusBadge from "./StatusBadge";
import ReplyForm from "./ReplyForm";
import {
  updateInquiryStatus,
  updateInquiryNotes,
  deleteInquiry,
  markInquiryRead,
  type NotesState,
} from "./actions";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

const initialNotesState: NotesState = { status: "idle", error: null };

function NotesForm({ id, notes }: { id: string; notes: string | null }) {
  const [state, formAction, pending] = useActionState(updateInquiryNotes, initialNotesState);
  useRefreshOnSuccess(state.status === "success");

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label
        htmlFor="notes"
        className="text-xs font-medium uppercase tracking-wide text-gray-400"
      >
        Internal notes
      </label>
      <textarea
        id="notes"
        name="notes"
        rows={5}
        defaultValue={notes ?? ""}
        placeholder="Only visible to admins — e.g. follow-up plan, call log…"
        className="min-h-32 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
      />
      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.status === "success" && (
        <p role="status" className="text-sm text-teal">
          Saved.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save notes"}
      </button>
    </form>
  );
}

function timeAgo(date: Date): string {
  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export default function InquiryDetailPanel({
  inquiry,
  replies,
  emailConfigured,
}: {
  inquiry: Inquiry;
  replies: InquiryReply[];
  emailConfigured: boolean;
}) {
  const statusFormRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!inquiry.isRead) {
      markInquiryRead(inquiry.id).catch(() => {});
    }
    // Only ever needs to fire once, when this panel first mounts for this inquiry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiry.id]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-navy">{inquiry.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Received {timeAgo(inquiry.createdAt)}
          </p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      {/* Main content (contact details, message, replies) gets the wide
          column — the status/notes/delete sidebar only needs enough room
          for a dropdown and a textarea, so splitting 2:1 instead of
          stacking everything full-width uses the page's actual space
          instead of leaving the right side empty. */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a href={`mailto:${inquiry.email}`} className="hover:text-navy">
                  {inquiry.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {inquiry.phone || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Service
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {inquiry.serviceCategory || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Source
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{inquiry.source}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Message
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                {inquiry.message || "—"}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Reply to this inquiry</h3>
            <div className="mt-3">
              <ReplyForm inquiryId={inquiry.id} emailConfigured={emailConfigured} />
            </div>

            {replies.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Reply history
                </h4>
                {replies.map((reply) => (
                  <div key={reply.id} className="rounded-lg bg-gray-50 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-gray-500">
                        {timeAgo(reply.createdAt)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          reply.method === "email"
                            ? "bg-teal/10 text-teal"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {reply.method === "email" ? "Sent via email" : "Opened in mail app"}
                      </span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-800">
                      {reply.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Status</h3>
            <form
              ref={statusFormRef}
              action={updateInquiryStatus}
              className="mt-3"
            >
              <input type="hidden" name="id" value={inquiry.id} />
              <Select
                id="status"
                name="status"
                defaultValue={inquiry.status}
                onChange={() => statusFormRef.current?.requestSubmit()}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <NotesForm id={inquiry.id} notes={inquiry.notes} />
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
            <h3 className="text-sm font-semibold text-gray-900">Danger zone</h3>
            <p className="mt-1 text-xs text-gray-500">This can&apos;t be undone.</p>
            <form ref={deleteFormRef} action={deleteInquiry} className="mt-3">
              <input type="hidden" name="id" value={inquiry.id} />
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete inquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this inquiry?"
        message={`Delete the inquiry from "${inquiry.name}"? This can't be undone.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          deleteFormRef.current?.requestSubmit();
        }}
      />
    </div>
  );
}
