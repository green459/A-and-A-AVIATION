"use client";

import { useActionState } from "react";
import { FormField, TextInput } from "../_components/FormField";
import { updateContactInfo, type SettingsFormState } from "./actions";
import type { ContactInfo } from "@/lib/data/settings";

const initialState: SettingsFormState = { error: null, success: false };

export default function ContactInfoForm({ values }: { values: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    updateContactInfo,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Contact info</h2>
      <p className="text-sm text-gray-500">
        Shown in the footer, and used for the navbar Call Now and WhatsApp buttons.
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="phone" label="Phone (display + tel: link)">
          <TextInput
            id="phone"
            name="phone"
            defaultValue={values.phone}
            placeholder="+88 1965 323232"
          />
        </FormField>
        <FormField id="whatsapp" label="WhatsApp number (digits only)">
          <TextInput
            id="whatsapp"
            name="whatsapp"
            defaultValue={values.whatsapp}
            placeholder="8801965323232"
          />
        </FormField>
        <FormField id="email" label="Email">
          <TextInput
            id="email"
            name="email"
            type="email"
            defaultValue={values.email}
          />
        </FormField>
        <FormField id="address" label="Office address">
          <TextInput id="address" name="address" defaultValue={values.address} />
        </FormField>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm font-medium text-gray-700">Office map location</p>
        <p className="mt-1 text-xs text-gray-500">
          Where the pin sits on the contact page map. Get coordinates by
          right-clicking the spot on{" "}
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-navy underline hover:text-gold"
          >
            Google Maps
          </a>{" "}
          — the first item in the menu is the lat/lng, which copies to your
          clipboard when clicked.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="latitude" label="Latitude">
            <TextInput
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              min={-90}
              max={90}
              required
              defaultValue={values.latitude}
              placeholder="23.8232"
            />
          </FormField>
          <FormField id="longitude" label="Longitude">
            <TextInput
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              min={-180}
              max={180}
              required
              defaultValue={values.longitude}
              placeholder="90.4283"
            />
          </FormField>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save contact info"}
      </button>
    </form>
  );
}
