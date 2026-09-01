"use client";

import { useActionState } from "react";
import ImageRepeatingFieldsField from "../_components/ImageRepeatingFieldsField";
import { useUploadSizeGuard } from "../_components/upload-guard";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateHomeTicketCards, type SettingsFormState } from "./actions";
import type { HomeTicketCard } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function HomeTicketCardsForm({
  values,
}: {
  values: HomeTicketCard[];
}) {
  const [state, formAction, pending] = useActionState(
    updateHomeTicketCards,
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
      <h2 className="font-display text-lg text-navy">Air ticketing cards</h2>
      <p className="text-sm text-gray-500">
        The scrolling ticket-type cards below the &quot;Air Ticketing&quot;
        section on the homepage.
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
        baseName="ticketCards"
        label="Cards"
        fields={[
          { key: "title", label: "Title, e.g. Domestic Air Tickets" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
        defaultValues={values.map((c) => ({
          image: c.image,
          title: c.title,
          description: c.description,
        }))}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save ticket cards"}
      </button>
    </form>
  );
}
