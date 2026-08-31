"use client";

import { useActionState } from "react";
import ImageRepeatingFieldsField from "../_components/ImageRepeatingFieldsField";
import { useUploadSizeGuard } from "../_components/upload-guard";
import { updateHomeServiceCards, type SettingsFormState } from "./actions";
import type { HomeServiceCard } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function HomeServiceCardsForm({
  values,
}: {
  values: HomeServiceCard[];
}) {
  const [state, formAction, pending] = useActionState(
    updateHomeServiceCards,
    initialState,
  );
  const uploadGuard = useUploadSizeGuard();

  return (
    <form
      action={formAction}
      onSubmit={uploadGuard.onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">
        Beyond Our Services cards
      </h2>
      <p className="text-sm text-gray-500">
        The &quot;More Services&quot; cards under &quot;Complete Travel
        Support Beyond Flights &amp; Visas&quot; on the homepage.
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
        baseName="serviceCards"
        label="Cards"
        fields={[
          { key: "category", label: "Category, e.g. Hotel" },
          { key: "title", label: "Title, e.g. Worldwide Hotel Reservations" },
        ]}
        defaultValues={values.map((c) => ({
          image: c.image,
          category: c.category,
          title: c.title,
        }))}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save service cards"}
      </button>
    </form>
  );
}
