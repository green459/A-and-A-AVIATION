"use client";

import { useActionState } from "react";
import {
  updateProfile,
  changePassword,
  type ProfileState,
  type ChangePasswordState,
} from "./actions";

const profileInitialState: ProfileState = { error: null, success: false };
const passwordInitialState: ChangePasswordState = { error: null };

function Field({
  id,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        {...props}
      />
    </div>
  );
}

export function ProfileDetailsForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    profileInitialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Profile details</h2>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Profile updated.
        </p>
      )}

      <Field id="name" label="Name" defaultValue={name} required maxLength={120} />
      <Field
        id="email"
        label="Email"
        type="email"
        defaultValue={email}
        required
        autoComplete="email"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    passwordInitialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Change password</h2>
      <p className="text-sm text-gray-500">
        You&apos;ll be signed out everywhere and need to sign in again.
      </p>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field
        id="currentPassword"
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
      />
      <Field
        id="newPassword"
        label="New password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <Field
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
