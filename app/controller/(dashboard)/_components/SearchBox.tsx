"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";

/** Search input with a clear (×) button that appears once there's text —
 * clearing resets the value and resubmits the enclosing GET form so the
 * search filter drops immediately. */
export default function SearchBox({
  name = "q",
  defaultValue,
  placeholder,
}: {
  name?: string;
  defaultValue: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(!!defaultValue);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => setHasValue(!!e.target.value)}
        className="w-56 rounded-lg border border-gray-300 py-2 pl-9 pr-8 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy sm:w-64"
      />
      {hasValue && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            const input = inputRef.current;
            if (!input) return;
            input.value = "";
            setHasValue(false);
            input.form?.requestSubmit();
          }}
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
