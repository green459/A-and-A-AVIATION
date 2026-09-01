"use client";

import { useActionState } from "react";
import { ColorField } from "../_components/FormField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateServiceDetailHero, type SettingsFormState } from "./actions";
import type { ServiceDetailHero } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function ServiceDetailHeroForm({
  values,
}: {
  values: ServiceDetailHero;
}) {
  const [state, formAction, pending] = useActionState(
    updateServiceDetailHero,
    initialState,
  );
  useRefreshOnSuccess(state.success);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">
        Individual service page hero
      </h2>
      <p className="text-sm text-gray-500">
        Every /services/[service] page uses its own title and image (edit
        those on the Services page in the sidebar) — this only controls the
        hero text&apos;s color, applied the same way across all of them.
      </p>

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ColorField name="titleColor" label="Text color" defaultValue={values.titleColor} />
        <ColorField name="shadowColor" label="Shadow/glow color" defaultValue={values.shadowColor} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save hero"}
      </button>
    </form>
  );
}
