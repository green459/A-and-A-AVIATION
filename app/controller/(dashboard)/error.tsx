"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

/** Catches any otherwise-uncaught error under the admin dashboard — most
 * notably a Server Action request whose multipart body got truncated by
 * Next's request-size ceiling (see next.config.ts) and crashed the
 * multipart parser server-side. Client-side validation in the image upload
 * fields (lib/image-constraints.ts, upload-guard.ts) stops that from
 * happening in the first place; this is the fallback so an admin never sees
 * a blank/broken page if something still slips through. */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isLikelyUploadIssue = /form|body|multipart/i.test(error.message);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="font-display text-xl text-navy">Something went wrong</h1>
      <p className="max-w-md text-sm text-gray-500">
        {isLikelyUploadIssue
          ? "This usually happens when the images attached to a form add up to too much data in one save. Try again with fewer or smaller images — each image can be up to 5MB."
          : "An unexpected error occurred while saving. Your other changes weren't affected — please try again."}
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover"
        >
          Try again
        </button>
        <Link
          href="/controller"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
