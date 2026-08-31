"use client";

import { useActionState } from "react";
import { FormField, TextInput } from "../_components/FormField";
import RepeatingFieldsField from "../_components/RepeatingFieldsField";
import { updateAboutProcess, type SettingsFormState } from "./actions";
import type { AboutProcess } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function AboutProcessForm({ values }: { values: AboutProcess }) {
  const [state, formAction, pending] = useActionState(
    updateAboutProcess,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">How We Work</h2>
      <p className="text-sm text-gray-500">
        The numbered process steps on the About page (numbers are
        auto-generated from the order below).
      </p>

      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="sectionLabel" label="Section label">
          <TextInput id="sectionLabel" name="sectionLabel" defaultValue={values.sectionLabel} />
        </FormField>
        <FormField id="sectionTitle" label="Section title">
          <TextInput id="sectionTitle" name="sectionTitle" defaultValue={values.sectionTitle} />
        </FormField>
      </div>

      <RepeatingFieldsField
        baseName="process"
        label="Steps"
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
        defaultValues={values.items}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save steps"}
      </button>
    </form>
  );
}
