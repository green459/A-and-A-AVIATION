"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from "./actions";

const initialState: ForgotPasswordState = {
  submitted: false,
  error: null,
};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state.submitted) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl text-navy">Check the link</h1>
          <p className="mt-1 text-sm text-gray-500">
            No email sending is configured yet. If that address has an
            account, a one-time reset link was generated for it.
          </p>
        </div>

        <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
          An administrator with server access can retrieve the link from the
          server logs to complete the reset.
        </p>

        <Link
          href="/controller/login"
          className="text-sm font-medium text-navy hover:text-gold"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl text-navy">Forgot password</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your admin email and we&apos;ll generate a one-time reset
          link.
        </p>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-navy py-3 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Generating link…" : "Generate reset link"}
      </button>

      <Link
        href="/controller/login"
        className="text-center text-sm font-medium text-navy hover:text-gold"
      >
        Back to sign in
      </Link>
    </form>
  );
}
