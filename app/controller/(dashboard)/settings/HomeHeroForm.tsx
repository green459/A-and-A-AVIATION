"use client";

import { useActionState } from "react";
import { FormField, TextInput } from "../_components/FormField";
import { updateHomeHero, type SettingsFormState } from "./actions";
import type { HomeHero } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function HomeHeroForm({ values }: { values: HomeHero }) {
  const [state, formAction, pending] = useActionState(
    updateHomeHero,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Homepage hero</h2>
      <p className="text-sm text-gray-500">
        The full-screen headline at the top of the homepage.
      </p>

      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved.
        </p>
      )}

      <FormField id="eyebrow" label="Eyebrow text">
        <TextInput id="eyebrow" name="eyebrow" defaultValue={values.eyebrow} />
      </FormField>
      <FormField id="title" label="Title (large gold text)">
        <TextInput id="title" name="title" defaultValue={values.title} />
      </FormField>
      <FormField id="subtitle" label="Subtitle">
        <TextInput id="subtitle" name="subtitle" defaultValue={values.subtitle} />
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="ctaLabel" label="Button label">
          <TextInput id="ctaLabel" name="ctaLabel" defaultValue={values.ctaLabel} />
        </FormField>
        <FormField id="ctaHref" label="Button link">
          <TextInput id="ctaHref" name="ctaHref" defaultValue={values.ctaHref} />
        </FormField>
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
