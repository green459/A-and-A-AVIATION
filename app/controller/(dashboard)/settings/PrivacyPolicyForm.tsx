"use client";

import { useActionState } from "react";
import { FormField, TextInput, TextArea } from "../_components/FormField";
import RepeatingFieldsField from "../_components/RepeatingFieldsField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updatePrivacyPolicy, type SettingsFormState } from "./actions";
import type { PrivacyPolicyContent } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function PrivacyPolicyForm({
  values,
}: {
  values: PrivacyPolicyContent;
}) {
  const [state, formAction, pending] = useActionState(
    updatePrivacyPolicy,
    initialState,
  );
  useRefreshOnSuccess(state.success);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Privacy Policy page</h2>
      <p className="text-sm text-gray-500">
        Section bodies are plain text — line breaks become paragraphs, no
        HTML formatting needed.
      </p>

      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved.
        </p>
      )}

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
        {pending ? "Saving…" : "Save privacy policy"}
      </button>
    </form>
  );
}
