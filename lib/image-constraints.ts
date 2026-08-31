// Shared between the server-side upload handler (lib/upload.ts) and the
// admin's client-side image inputs, so both enforce the exact same limits
// and never drift apart. Framework-agnostic — no Node-only imports — so it's
// safe to import from client components too.

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

export const ALLOWED_IMAGE_ACCEPT = Object.keys(ALLOWED_IMAGE_TYPES).join(",");

export function formatMegabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** Client-side pre-check before a file is attached to a form — catches an
 * oversized or wrong-type image immediately, with a message the admin can
 * act on, instead of letting it ride along in a multipart body that the
 * request-size ceilings in next.config.ts (serverActions.bodySizeLimit /
 * proxyClientMaxBodySize) would otherwise silently truncate — which crashes
 * the multipart parser server-side ("Unexpected end of form") rather than
 * failing cleanly. lib/upload.ts makes the same checks server-side; that
 * remains the authoritative check, this is just an earlier, friendlier one. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    return "Unsupported image type. Use JPG, PNG, WEBP, GIF or SVG.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `That image is ${formatMegabytes(file.size)} — please use one ${formatMegabytes(MAX_IMAGE_SIZE_BYTES)} or smaller.`;
  }
  return null;
}
