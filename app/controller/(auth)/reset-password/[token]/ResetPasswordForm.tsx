"use client";

import { useActionState } from "react";
import { resetPassword, type ResetPasswordState } from "./actions";

const initialState: ResetPasswordState = { error: null };

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl text-navy">Set a new password</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose a new password for your admin account.
        </p>
      </div>

      <input type="hidden" name="token" value={token} />

      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-navy py-3 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
