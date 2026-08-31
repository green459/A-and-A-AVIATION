"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

/** Repeatable text-line input (features, highlights, "popular for" tags, ...).
 * Renders one input per item sharing `name`, so the server action can read
 * every value at once via `formData.getAll(name)`. */
export default function DynamicListField({
  name,
  label,
  defaultValues,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValues?: string[];
  placeholder?: string;
}) {
  const [values, setValues] = useState<string[]>(
    defaultValues && defaultValues.length > 0 ? defaultValues : [""],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex flex-col gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              name={name}
              defaultValue={value}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            />
            <button
              type="button"
              onClick={() =>
                setValues((current) =>
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
        onClick={() => setValues((current) => [...current, ""])}
        className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-navy hover:text-gold"
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    </div>
  );
}
