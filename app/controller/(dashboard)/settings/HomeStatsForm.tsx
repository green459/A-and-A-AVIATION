"use client";

import { useActionState } from "react";
import RepeatingFieldsField from "../_components/RepeatingFieldsField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateHomeStats, type SettingsFormState } from "./actions";
import type { HomeStat } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function HomeStatsForm({ values }: { values: HomeStat[] }) {
  const [state, formAction, pending] = useActionState(
    updateHomeStats,
    initialState,
  );
  useRefreshOnSuccess(state.success);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Homepage stats</h2>
      <p className="text-sm text-gray-500">
        The four large numbers on the &quot;Global Opportunities&quot; section.
      </p>

      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved.
        </p>
      )}

      <RepeatingFieldsField
        baseName="stats"
        label="Stats"
        fields={[
          { key: "value", label: "Value, e.g. 50+" },
          { key: "label", label: "Label, e.g. Successful Visa Applications" },
        ]}
        defaultValues={values}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save stats"}
      </button>
    </form>
  );
}
