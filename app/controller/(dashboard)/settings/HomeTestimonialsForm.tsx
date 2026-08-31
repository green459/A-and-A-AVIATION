"use client";

import { useActionState } from "react";
import RepeatingFieldsField from "../_components/RepeatingFieldsField";
import { updateHomeTestimonials, type SettingsFormState } from "./actions";
import type { HomeTestimonial } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function HomeTestimonialsForm({
  values,
}: {
  values: HomeTestimonial[];
}) {
  const [state, formAction, pending] = useActionState(
    updateHomeTestimonials,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Client testimonials</h2>
      <p className="text-sm text-gray-500">
        Shown in the &quot;Client Reviews&quot; slider on the homepage.
      </p>

      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved.
        </p>
      )}

      <RepeatingFieldsField
        baseName="testimonials"
        label="Testimonials"
        fields={[
          { key: "quote", label: "Quote", type: "textarea" },
          { key: "name", label: "Name" },
          { key: "role", label: "Role, e.g. Business Owner" },
          { key: "caption", label: "Caption, e.g. great experience" },
        ]}
        defaultValues={values}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save testimonials"}
      </button>
    </form>
  );
}
