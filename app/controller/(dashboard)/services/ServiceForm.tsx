"use client";

import { useActionState, useState } from "react";
import { FormField, TextInput, TextArea } from "../_components/FormField";
import DynamicListField from "../_components/DynamicListField";
import ImageField from "../_components/ImageField";
import SeoFields from "../_components/SeoFields";
import { slugify } from "@/lib/slug";
import type { ServiceFormState } from "./actions";

const initialState: ServiceFormState = { error: null };

export interface ServiceFormValues {
  title: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  image?: string;
  order: number;
  isPublished: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export default function ServiceForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (
    prevState: ServiceFormState,
    formData: FormData,
  ) => Promise<ServiceFormState>;
  defaultValues?: ServiceFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!defaultValues);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <FormField id="title" label="Title">
        <TextInput
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </FormField>

      <FormField id="slug" label="Slug">
        <TextInput
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField id="category" label="Category">
          <TextInput
            id="category"
            name="category"
            required
            defaultValue={defaultValues?.category}
          />
        </FormField>
        <FormField id="order" label="Order">
          <TextInput
            id="order"
            name="order"
            type="number"
            defaultValue={defaultValues?.order ?? 0}
          />
        </FormField>
      </div>

      <FormField id="tagline" label="Tagline">
        <TextInput
          id="tagline"
          name="tagline"
          required
          defaultValue={defaultValues?.tagline}
        />
      </FormField>

      <FormField id="description" label="Description">
        <TextArea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={defaultValues?.description}
        />
      </FormField>

      <DynamicListField
        name="features"
        label="Features"
        defaultValues={defaultValues?.features}
        placeholder="e.g. Instant booking confirmation"
      />

      <ImageField
        currentImage={defaultValues?.image}
        required={!defaultValues}
      />

      <SeoFields
        metaTitle={defaultValues?.metaTitle}
        metaDescription={defaultValues?.metaDescription}
      />

      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={defaultValues?.isPublished ?? true}
          className="h-4 w-4 accent-navy"
        />
        Published
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
