"use client";

import { useActionState } from "react";
import { FormField, TextInput, TextArea } from "../_components/FormField";
import RepeatingFieldsField from "../_components/RepeatingFieldsField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateTermsConditions, type SettingsFormState } from "./actions";
import type { TermsConditionsContent } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function TermsConditionsForm({
  values,
}: {
  values: TermsConditionsContent;
}) {
  const [state, formAction, pending] = useActionState(
    updateTermsConditions,
    initialState,
  );
  useRefreshOnSuccess(state.success);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Terms &amp; Conditions page</h2>
      <p className="text-sm text-gray-500">
        Section bodies are plain text — line breaks become paragraphs, no
        HTML formatting needed.
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

      <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          name="enabled"
          value="true"
          defaultChecked={values.enabled}
          className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
        />
        Page is live
        <span className="font-normal text-gray-500">
          — when off, /terms-and-conditions returns 404 and it&apos;s hidden
          from the contact form&apos;s agreement text.
        </span>
      </label>

      <FormField id="intro" label="Intro paragraph">
        <TextArea id="intro" name="intro" rows={2} defaultValue={values.intro} />
      </FormField>
      <FormField id="lastUpdated" label="Last updated (shown as-is, e.g. &quot;11 August 2026&quot;)">
        <TextInput id="lastUpdated" name="lastUpdated" defaultValue={values.lastUpdated} />
      </FormField>

      <RepeatingFieldsField
        baseName="sections"
        label="Sections"
        fields={[
          { key: "title", label: "Section title" },
          { key: "body", label: "Section body", type: "textarea" },
        ]}
        defaultValues={values.sections}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save terms & conditions"}
      </button>
    </form>
  );
}
