"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Calls `router.refresh()` whenever `success` flips to `true`, so the
 * browser's client-side router cache is busted and the page re-fetches
 * fresh server-component data. Without this, `revalidatePath()` only
 * invalidates the *server-side* Data Cache — the browser keeps serving
 * stale page segments until a hard refresh or navigation.
 */
export function useRefreshOnSuccess(success: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (success) {
      router.refresh();
    }
  }, [success, router]);
}
