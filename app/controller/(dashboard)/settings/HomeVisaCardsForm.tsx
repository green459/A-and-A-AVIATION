"use client";

import { useActionState } from "react";
import ImageRepeatingFieldsField from "../_components/ImageRepeatingFieldsField";
import { useUploadSizeGuard } from "../_components/upload-guard";
import { updateHomeVisaCards, type SettingsFormState } from "./actions";
import type { HomeVisaCard } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function HomeVisaCardsForm({
  values,
}: {
  values: HomeVisaCard[];
}) {
  const [state, formAction, pending] = useActionState(
    updateHomeVisaCards,
    initialState,
  );
  const uploadGuard = useUploadSizeGuard();

  return (
    <form
      action={formAction}
      onSubmit={uploadGuard.onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Visa cards marquee</h2>
      <p className="text-sm text-gray-500">
        The scrolling cards below the &quot;Trusted Travel &amp; Visa
        Solutions&quot; heading on the homepage.
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
        baseName="visaCards"
        label="Cards"
        fields={[
          { key: "tag", label: "Tag, e.g. Portugal Visa-01" },
          { key: "title", label: "Title, e.g. Work Visa" },
        ]}
        defaultValues={values.map((c) => ({
          image: c.image,
          tag: c.tag,
          title: c.title,
        }))}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save visa cards"}
      </button>
    </form>
  );
}
