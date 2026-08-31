"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Select } from "./FormField";

interface FieldSpec {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
}

/** Repeatable multi-field rows (e.g. testimonials: quote/name/role/caption).
 * Each field submits as `${baseName}_${fieldKey}`, a parallel array across
 * rows, so the server action zips them back together by index.
 *
 * Wrapped below with a `key` derived from `defaultValues` (see the default
 * export) — see that wrapper's comment for why. */
function RepeatingFieldsFieldInner({
  baseName,
  label,
  fields,
  defaultValues,
}: {
  baseName: string;
  label: string;
  fields: FieldSpec[];
  defaultValues?: Record<string, string>[];
}) {
  const [rows, setRows] = useState<Record<string, string>[]>(
    defaultValues && defaultValues.length > 0
      ? defaultValues
      : [Object.fromEntries(fields.map((f) => [f.key, ""]))],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3"
          >
            {fields.map((field) => {
              if (field.type === "select") {
                return (
                  <Select
                    key={field.key}
                    name={`${baseName}_${field.key}`}
                    defaultValue={row[field.key] || field.options?.[0]?.value}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                );
              }
              if (field.type === "textarea") {
                return (
                  <textarea
                    key={field.key}
                    name={`${baseName}_${field.key}`}
                    defaultValue={row[field.key]}
                    placeholder={field.label}
                    rows={4}
                    className="min-h-24 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                );
              }
              return (
                <input
                  key={field.key}
                  name={`${baseName}_${field.key}`}
                  defaultValue={row[field.key]}
                  placeholder={field.label}
                  className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                />
              );
            })}
            <button
              type="button"
              onClick={() =>
                setRows((current) =>
                  current.length > 1
                    ? current.filter((_, i) => i !== index)
                    : current,
                )
              }
              className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-red-600 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setRows((current) => [
            ...current,
            Object.fromEntries(fields.map((f) => [f.key, ""])),
          ])
        }
        className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-navy hover:text-gold"
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    </div>
  );
}

/** `rows` above only reads `defaultValues` once, on mount — React doesn't
 * re-run a `useState` initializer when props change on a later render. So
 * once the admin edits a row (or adds a new blank one), the field is
 * disconnected from `defaultValues` for the rest of that page's lifetime.
 * That's normally fine (uncontrolled inputs are meant to own their own
 * value) — except React *also* resets every uncontrolled field in a
 * submitted form back to its `defaultValue` prop once the action settles.
 * Combined, a brand-new row's `defaultValue` is still "" from when it was
 * added, and any text just typed into it gets wiped back to blank right
 * after a successful save, even though the save itself worked. Keying on
 * `defaultValues`'s content forces a full remount exactly when the parent
 * hands down genuinely new (post-save, revalidated) data — reinitializing
 * `rows` from the real saved values instead of the stale local ones, so
 * the reset lands on the correct text instead of erasing it. */
export default function RepeatingFieldsField(
  props: Parameters<typeof RepeatingFieldsFieldInner>[0],
) {
  return (
    <RepeatingFieldsFieldInner
      key={JSON.stringify(props.defaultValues)}
      {...props}
    />
  );
}
