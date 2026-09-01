"use client";

import { useActionState } from "react";
import { FormField, TextInput, TextArea } from "../_components/FormField";
import { useRefreshOnSuccess } from "../_components/useRefreshOnSuccess";
import { updateSeoMeta, type SeoFormState } from "./actions";

const initialState: SeoFormState = { error: null, success: false };

export default function SeoPageForm({
  path,
  label,
  title,
  description,
  noindex,
}: {
  path: string;
  label: string;
  title: string;
  description: string;
  noindex: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateSeoMeta,
    initialState,
  );
  useRefreshOnSuccess(state.success);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg text-navy">{label}</h2>
        <span className="text-xs text-gray-400">{path}</span>
      </div>

      <input type="hidden" name="path" value={path} />

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

      <FormField id={`title-${path}`} label="Meta title">
        <TextInput
          id={`title-${path}`}
          name="title"
          required
          defaultValue={title}
        />
      </FormField>

      <FormField id={`description-${path}`} label="Meta description">
        <TextArea
          id={`description-${path}`}
          name="description"
          required
          rows={2}
          defaultValue={description}
        />
      </FormField>

      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          name="noindex"
          defaultChecked={noindex}
          className="h-4 w-4 accent-navy"
        />
        Hide from search engines (noindex)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
