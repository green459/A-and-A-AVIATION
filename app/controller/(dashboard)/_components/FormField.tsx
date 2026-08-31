"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";

export function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      rows={5}
      {...props}
      className={`min-h-32 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy ${props.className ?? ""}`}
    />
  );
}

/** A native color swatch paired with an editable hex input, both kept in
 * sync — the swatch is the easy picker, the text field is there for typing
 * an exact value or seeing what's currently set. Submits as a single `name`
 * field (a plain hex string). Controlled by local state rather than
 * `defaultValue`, so it doesn't need the uncontrolled-field defaultValue
 * dance the repeating-row fields elsewhere use. */
export function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={`${label} swatch`}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-gray-300 p-1"
        />
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000"
          className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>
    </div>
  );
}

interface SelectOptionProps {
  value: string;
  children?: React.ReactNode;
}

/** A fully custom dropdown, styled to match the rest of the admin UI.
 * Native <option> elements can't be restyled by CSS in any browser — only
 * the closed <select> box can — so matching the app's look (rounded
 * corners, hover/selected states, brand colors) for the open list requires
 * building the listbox ourselves. Drop-in compatible with plain <option>
 * children so call sites read like a native select. */
export function Select({
  id,
  name,
  value,
  defaultValue,
  onChange,
  children,
  className,
}: {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const options: SelectOptionProps[] = Children.toArray(children)
    .filter(isValidElement<SelectOptionProps>)
    .map((el) => ({ value: el.props.value, children: el.props.children }));

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const current = isControlled ? value : internalValue;
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Flip the listbox above the trigger when there isn't enough room below
  // (e.g. this Select sitting near the bottom of a modal) — otherwise it
  // gets visually clipped/overlaps whatever's behind the modal instead of
  // showing the options. Re-measured every time it opens, since the same
  // Select can end up in different amounts of scroll position each time.
  useEffect(() => {
    if (!open || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const estimatedListHeight = Math.min(options.length * 40 + 12, 256) + 6;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setPlacement(
      spaceBelow < estimatedListHeight && spaceAbove > spaceBelow ? "top" : "bottom",
    );
  }, [open, options.length]);

  const selected = options.find((o) => o.value === current);

  const handleSelect = (v: string) => {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ""}`}>
      {name && <input type="hidden" name={name} value={current} readOnly />}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-left text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
      >
        <span className="truncate">{selected?.children}</span>
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M2 4 L6 8 L10 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 z-20 transition-all duration-150 ${
          placement === "top" ? "bottom-full pb-1.5" : "top-full pt-1.5"
        } ${
          open
            ? "visible translate-y-0 opacity-100"
            : `invisible opacity-0 ${placement === "top" ? "translate-y-1" : "-translate-y-1"}`
        }`}
      >
        <ul className="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={current === option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  current === option.value
                    ? "bg-navy text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.children}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
