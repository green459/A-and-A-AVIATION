interface Bucket {
  count: number;
  resetAt: number;
}

// In-memory, per-process — resets on deploy/restart and doesn't share state
// across multiple instances. Good enough to blunt naive brute-force/spam
// on a single-server deployment; swap for a shared store (Redis, etc.) if
// this ever runs behind a load balancer with multiple instances.
const buckets = new Map<string, Bucket>();

/** Returns true if `key` has exceeded `limit` calls within `windowMs`. */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

/** Best-effort client IP from standard proxy headers (set by most reverse
 * proxies / platforms). Falls back to a constant so rate limiting still
 * applies (shared globally) rather than silently no-opping when absent. */
export async function getClientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
