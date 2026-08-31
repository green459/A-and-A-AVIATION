"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";
import { clearAllCaches, type ClearCacheState } from "./actions";

const initialState: ClearCacheState = { clearedAt: null };

export default function ClearCacheForm() {
  const [state, formAction, pending] = useActionState(
    clearAllCaches,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-lg text-navy">Cache</h2>
      <p className="text-sm text-gray-500">
        Forces every page to regenerate on its next visit. Use this if a
        change isn&apos;t showing up yet.
      </p>

      {state.clearedAt && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Cache cleared at{" "}
          {new Date(state.clearedAt).toLocaleTimeString("en-GB")}.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center gap-2 self-start rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
        {pending ? "Clearing…" : "Clear all caches"}
      </button>
    </form>
  );
}
