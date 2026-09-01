"use client";

import { useActionState } from "react";
import ImageRepeatingFieldsField from "../_components/ImageRepeatingFieldsField";
import { useUploadSizeGuard } from "../_components/upload-guard";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateHomePeopleGallery, type SettingsFormState } from "./actions";
import type { HomePeopleGalleryImage } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function HomePeopleGalleryForm({
  values,
}: {
  values: HomePeopleGalleryImage[];
}) {
  const [state, formAction, pending] = useActionState(
    updateHomePeopleGallery,
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
        Traveler photo gallery
      </h2>
      <p className="text-sm text-gray-500">
        The scrolling photo strip right above the stats (&quot;Connecting
        People With Global Opportunities&quot; section) on the homepage.
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

      <ImageRepeatingFieldsField
        baseName="peopleGallery"
        label="Photos"
        fields={[
          { key: "alt", label: "Alt text, e.g. Traveler at a mountain overlook" },
          { key: "tall", label: "Taller image", type: "checkbox" },
        ]}
        defaultValues={values.map((g) => ({
          image: g.image,
          alt: g.alt,
          tall: g.tall ? "true" : "false",
        }))}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save gallery"}
      </button>
    </form>
  );
}
