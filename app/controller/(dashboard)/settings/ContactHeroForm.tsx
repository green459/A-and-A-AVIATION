"use client";

import { useActionState } from "react";
import { FormField, TextInput, TextArea, ColorField } from "../_components/FormField";
import ImageField from "../_components/ImageField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateContactHero, type SettingsFormState } from "./actions";
import type { ContactPageHero } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function ContactHeroForm({
  values,
}: {
  values: ContactPageHero;
}) {
  const [state, formAction, pending] = useActionState(
    updateContactHero,
    initialState,
  );
  useRefreshOnSuccess(state.success);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Contact page hero</h2>
      <p className="text-sm text-gray-500">
        The full-screen banner at the top of the Contact page. Eyebrow and
        subtitle are optional — leave them blank to keep just the title.
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

      <FormField id="eyebrow" label="Eyebrow text (optional)">
        <TextInput id="eyebrow" name="eyebrow" defaultValue={values.eyebrow} />
      </FormField>
      <FormField id="title" label="Title">
        <TextInput id="title" name="title" defaultValue={values.title} />
      </FormField>
      <FormField id="subtitle" label="Subtitle (optional)">
        <TextArea id="subtitle" name="subtitle" rows={2} defaultValue={values.subtitle} />
      </FormField>
      <ImageField currentImage={values.image} />

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
