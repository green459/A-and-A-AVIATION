"use client";

import { useActionState, useState } from "react";
import { FormField, TextInput, TextArea } from "../_components/FormField";
import DynamicListField from "../_components/DynamicListField";
import ImageField from "../_components/ImageField";
import SeoFields from "../_components/SeoFields";
import RichTextEditor from "./RichTextEditor";
import { slugify } from "@/lib/slug";
import type { BlogFormState } from "./actions";

const initialState: BlogFormState = { error: null };

export interface BlogFormValues {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  highlights: string[];
  image?: string;
  publishedAt: string; // yyyy-mm-dd
  isPublished: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export default function BlogForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (
    prevState: BlogFormState,
    formData: FormData,
  ) => Promise<BlogFormState>;
  defaultValues?: BlogFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!defaultValues);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
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
            placeholder="e.g. Visa Guide"
          />
        </FormField>
        <FormField id="publishedAt" label="Published date">
          <TextInput
            id="publishedAt"
            name="publishedAt"
            type="date"
            required
            defaultValue={
              defaultValues?.publishedAt ??
              new Date().toISOString().slice(0, 10)
            }
          />
        </FormField>
      </div>

      <FormField id="excerpt" label="Excerpt">
        <TextArea
          id="excerpt"
          name="excerpt"
          required
          rows={3}
          defaultValue={defaultValues?.excerpt}
        />
      </FormField>

      <FormField id="content-editor" label="Body">
        <RichTextEditor
          name="content"
          defaultValue={defaultValues?.content}
          placeholder="Write the article…"
        />
      </FormField>

      <DynamicListField
        name="highlights"
        label="Key takeaways"
        defaultValues={defaultValues?.highlights}
        placeholder="e.g. Book 6-10 weeks ahead"
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
