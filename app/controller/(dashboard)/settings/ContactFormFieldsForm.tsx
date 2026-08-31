"use client";

import { useActionState } from "react";
import { updateContactFormFields, type SettingsFormState } from "./actions";
import type { ContactFormFieldsSettings } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function ContactFormFieldsForm({
  values,
}: {
  values: ContactFormFieldsSettings;
}) {
  const [state, formAction, pending] = useActionState(
    updateContactFormFields,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Contact form fields</h2>
      <p className="text-sm text-gray-500">
        Turn optional fields on the contact form on or off. Shown on both the
        Home page and Contact page forms.
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

      <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          name="phoneFieldEnabled"
          value="true"
          defaultChecked={values.phoneFieldEnabled}
          className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
        />
        Show phone/mobile number field
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save contact form fields"}
      </button>
    </form>
  );
}
