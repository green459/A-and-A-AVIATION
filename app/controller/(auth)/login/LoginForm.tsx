"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginForm({
  next,
  resetSuccess,
}: {
  next?: string;
  resetSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl text-navy">Admin sign in</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to manage the A&amp;A Aviation website.
        </p>
      </div>

      {next && <input type="hidden" name="next" value={next} />}

      {resetSuccess && !state.error && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Password updated — sign in with your new password.
        </p>
      )}

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

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Link
            href="/controller/forgot-password"
            className="text-xs font-medium text-navy hover:text-gold"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-navy py-3 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
