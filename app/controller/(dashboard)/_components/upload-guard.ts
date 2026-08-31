"use client";

import { useState, type FormEvent } from "react";
import { formatMegabytes } from "@/lib/image-constraints";

// Stay comfortably under the request-body ceilings in next.config.ts
// (serverActions.bodySizeLimit / proxyClientMaxBodySize, both 10MB) — every
// row's image is already capped at 5MB individually (see
// lib/image-constraints.ts), but a form with several rows attached at once
// can still add up past that ceiling even when each file is valid on its
// own. Leaves headroom for multipart boundaries and the form's text fields.
export const MAX_TOTAL_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

/** Sums the size of every selected file across all file inputs in a form.
 * Used as a pre-submit guard so an oversized multipart body never reaches
 * the server — without it, the request gets silently truncated by Next's
 * body-size cap and crashes the Server Action's multipart parser instead of
 * failing cleanly. */
export function getFormFilesTotalSize(form: HTMLFormElement): number {
  const fileInputs = form.querySelectorAll<HTMLInputElement>('input[type="file"]');
  let total = 0;
  fileInputs.forEach((input) => {
    if (input.files) {
      for (const file of Array.from(input.files)) total += file.size;
    }
  });
  return total;
}

/** Returns a clear, actionable error message if the form's attached images
 * would exceed the safe total-upload ceiling, or null if it's fine to
 * submit. */
export function checkFormUploadSize(form: HTMLFormElement): string | null {
  const total = getFormFilesTotalSize(form);
  if (total <= MAX_TOTAL_UPLOAD_BYTES) return null;

  return `These images total ${formatMegabytes(total)}, which is too large to save in one go (max ${formatMegabytes(MAX_TOTAL_UPLOAD_BYTES)} per save). Try uploading fewer or smaller images, or save in a couple of batches.`;
}

/** Drop-in `<form onSubmit={...}>` guard: blocks submission and returns a
 * message to render when the attached images are too large, so the request
 * never reaches the server in a state that would crash the multipart
 * parser. Returns `null` (and lets the form submit normally) otherwise. */
export function useUploadSizeGuard() {
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const message = checkFormUploadSize(event.currentTarget);
    if (message) {
      event.preventDefault();
      setError(message);
    } else {
      setError(null);
    }
  };

  return { error, onSubmit };
}
