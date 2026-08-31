"use client";

import { useActionState } from "react";
import SocialLinksField from "./SocialLinksField";
import { useUploadSizeGuard } from "../_components/upload-guard";
import { updateSocialLinks, type SettingsFormState } from "./actions";
import type { SocialLink } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function SocialLinksForm({ values }: { values: SocialLink[] }) {
  const [state, formAction, pending] = useActionState(
    updateSocialLinks,
    initialState,
  );
  const uploadGuard = useUploadSizeGuard();

  return (
    <form
      action={formAction}
      onSubmit={uploadGuard.onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Social links</h2>
      <p className="text-sm text-gray-500">
        Shown as icons in the footer. Add, edit or remove as many as you
        like — pick &quot;Other&quot; for anything not in the list.
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

      <SocialLinksField defaultValues={values} />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save social links"}
      </button>
    </form>
  );
}
