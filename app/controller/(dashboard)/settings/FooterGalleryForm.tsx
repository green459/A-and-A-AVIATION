"use client";

import { useActionState } from "react";
import ImageListField from "../_components/ImageListField";
import { useUploadSizeGuard } from "../_components/upload-guard";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateFooterGallery, type SettingsFormState } from "./actions";
import type { FooterGalleryImage } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function FooterGalleryForm({
  values,
}: {
  values: FooterGalleryImage[];
}) {
  const [state, formAction, pending] = useActionState(
    updateFooterGallery,
    initialState,
  );
  useRefreshOnSuccess(state.success);
  const uploadGuard = useUploadSizeGuard();

  return (
    <form
      action={formAction}
      onSubmit={uploadGuard.onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">
        Footer photo strip (&quot;Beyond Our Services&quot;)
      </h2>
      <p className="text-sm text-gray-500">
        The photo grid above the footer&apos;s link columns, shown at the
        bottom of every page on the site — not just the homepage.
      </p>

      {uploadGuard.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {uploadGuard.error}
        </p>
      )}
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved.
        </p>
      )}

      <ImageListField
        baseName="footerGallery"
        label="Photos"
        labelPlaceholder="Alt text, e.g. Traveler at a mountain overlook"
        defaultValues={values.map((g) => ({ label: g.alt, image: g.image }))}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save footer photos"}
      </button>
    </form>
  );
}
