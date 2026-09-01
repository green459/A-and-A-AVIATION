"use client";

import { useActionState } from "react";
import { FormField, TextInput, TextArea } from "../_components/FormField";
import ImageField from "../_components/ImageField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateAboutStory, type SettingsFormState } from "./actions";
import type { AboutStory } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function AboutStoryForm({ values }: { values: AboutStory }) {
  const [state, formAction, pending] = useActionState(
    updateAboutStory,
    initialState,
  );
  useRefreshOnSuccess(state.success);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Our Story</h2>
      <p className="text-sm text-gray-500">
        The &quot;Our Story&quot; section on the About page.
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

      <FormField id="label" label="Section label">
        <TextInput id="label" name="label" defaultValue={values.label} />
      </FormField>
      <FormField id="title" label="Title">
        <TextInput id="title" name="title" defaultValue={values.title} />
      </FormField>
      <FormField id="paragraph1" label="Paragraph 1">
        <TextArea id="paragraph1" name="paragraph1" rows={3} defaultValue={values.paragraph1} />
      </FormField>
      <FormField id="paragraph2" label="Paragraph 2">
        <TextArea id="paragraph2" name="paragraph2" rows={3} defaultValue={values.paragraph2} />
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="ctaLabel" label="Button label">
          <TextInput id="ctaLabel" name="ctaLabel" defaultValue={values.ctaLabel} />
        </FormField>
        <FormField id="ctaHref" label="Button link">
          <TextInput id="ctaHref" name="ctaHref" defaultValue={values.ctaHref} />
        </FormField>
      </div>
      <ImageField currentImage={values.image} />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save story"}
      </button>
    </form>
  );
}
