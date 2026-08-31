"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { ALLOWED_IMAGE_ACCEPT, validateImageFile } from "@/lib/image-constraints";

interface FieldSpec {
  key: string;
  label: string;
  type?: "text" | "textarea" | "checkbox";
}

interface Row {
  image: string; // existing public path, "" for a brand-new row
  [key: string]: string;
}

function emptyRow(fields: FieldSpec[]): Row {
  return {
    image: "",
    ...Object.fromEntries(
      fields.map((f) => [f.key, f.type === "checkbox" ? "false" : ""]),
    ),
  };
}

/** Repeatable {image + arbitrary text/checkbox fields} rows — a generalized
 * version of ImageListField for cards that need more than one label
 * alongside their image (e.g. a card's tag + title, or title + description).
 * Every field submits as `${baseName}_${fieldKey}` (plus `_existingImage` /
 * `_newImage` for the image), a parallel array across rows, so the server
 * action can zip them back together by index.
 *
 * Wrapped below with a `key` derived from `defaultValues` (see the default
 * export) — see that wrapper's comment for why. */
function ImageRepeatingFieldsFieldInner({
  baseName,
  label,
  fields,
  defaultValues,
}: {
  baseName: string;
  label: string;
  fields: FieldSpec[];
  defaultValues?: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(
    defaultValues && defaultValues.length > 0
      ? defaultValues
      : [emptyRow(fields)],
  );
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 @lg:flex-row @lg:items-start"
          >
            {(previews[index] || row.image) && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={previews[index] ?? row.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized={!!previews[index]}
                />
              </div>
            )}
            <input
              type="hidden"
              name={`${baseName}_existingImage`}
              value={row.image}
            />

            <div className="flex flex-1 flex-col gap-2">
              {fields.map((field) => {
                if (field.type === "checkbox") {
                  const checked = row[field.key] === "true";
                  return (
                    <label
                      key={field.key}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setRows((current) =>
                            current.map((r, i) =>
                              i === index
                                ? {
                                    ...r,
                                    [field.key]: e.target.checked
                                      ? "true"
                                      : "false",
                                  }
                                : r,
                            ),
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                      />
                      {field.label}
                      <input
                        type="hidden"
                        name={`${baseName}_${field.key}`}
                        value={checked ? "true" : "false"}
                      />
                    </label>
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
              <input
                type="file"
                name={`${baseName}_newImage`}
                accept={ALLOWED_IMAGE_ACCEPT}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const message = validateImageFile(file);
                  if (message) {
                    setErrors((current) => ({ ...current, [index]: message }));
                    e.target.value = "";
                    return;
                  }

                  setErrors((current) => {
                    const next = { ...current };
                    delete next[index];
                    return next;
                  });
                  setPreviews((current) => ({
                    ...current,
                    [index]: URL.createObjectURL(file),
                  }));
                }}
                className="max-w-56 text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-hover"
              />
              {errors[index] && (
                <p role="alert" className="text-xs text-red-600">
                  {errors[index]}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setRows((current) =>
                  current.length > 1
                    ? current.filter((_, i) => i !== index)
                    : current,
                )
              }
              aria-label="Remove"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRows((current) => [...current, emptyRow(fields)])}
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
 * added, and any text/image just entered gets wiped back to blank right
 * after a successful save, even though the save actually worked. Keying on
 * `defaultValues`'s content forces a full remount exactly when the parent
 * hands down genuinely new (post-save, revalidated) data — reinitializing
 * `rows` from the real saved values instead of the stale local ones, so the
 * reset lands on the correct content instead of erasing it. */
export default function ImageRepeatingFieldsField(
  props: Parameters<typeof ImageRepeatingFieldsFieldInner>[0],
) {
  return (
    <ImageRepeatingFieldsFieldInner
      key={JSON.stringify(props.defaultValues)}
      {...props}
    />
  );
}
