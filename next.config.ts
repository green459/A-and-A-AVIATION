import type { NextConfig } from "next";

// No-nonce CSP (see node_modules/next/dist/docs/01-app/02-guides/
// content-security-policy.md) — a nonce-based policy would force every
// page to render dynamically, which would kill static generation for this
// marketing site. `unsafe-inline` for script/style is the documented
// baseline for that tradeoff. challenges.cloudflare.com is the Turnstile
// captcha widget; tile.openstreetmap.org/unpkg.com are the Leaflet contact
// map (components/home/LeafletMap.tsx). `unsafe-eval` is dev-only — React
// uses eval() in development for debugging call stacks; it's never used
// in production builds (same caveat the Next.js CSP guide calls out).
const isDev = process.env.NODE_ENV === "development";
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.tile.openstreetmap.org https://unpkg.com;
  frame-src https://challenges.cloudflare.com;
  connect-src 'self' https://challenges.cloudflare.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: cspHeader },
];

const nextConfig: NextConfig = {
  // output: "standalone",
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
  experimental: {
    serverActions: {
      // Default is 1MB. The admin's image-upload forms (partners, gallery,
      // service cards, etc.) submit files as multipart Server Action bodies,
      // and lib/upload.ts already caps each individual image at 5MB — raise
      // the request-body ceiling so a form with a few images attached at
      // once (or one image plus the multipart boundary/field overhead)
      // doesn't get rejected before that per-file check ever runs.
      bodySizeLimit: "10mb",
    },
    // proxy.ts buffers the request body separately from the Server Actions
    // parser above, defaulting to 10MB — set explicitly (rather than relying
    // on that default) so it can't silently drift out of sync with
    // bodySizeLimit. If a request exceeds THIS limit, proxy buffers only the
    // truncated prefix and lets the request continue — which is what
    // produces "Unexpected end of form" downstream in the Server Action's
    // multipart parser, since the body is now malformed. Client-side
    // per-file (lib/image-constraints.ts) and per-form total-size
    // (app/controller/(dashboard)/_components/upload-guard.ts) checks stop
    // an oversized request from being sent in the first place; keep this at
    // or above bodySizeLimit so it's never the first ceiling hit.
    proxyClientMaxBodySize: "10mb",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Prevent browsers from caching public pages so admin edits show up
      // instantly for all visitors (not just the admin who made the change).
      // `revalidatePath()` only busts the *server-side* Data Cache — the
      // visitor's browser still holds stale HTML from its last visit unless
      // we tell it not to cache. Uploaded images are excluded (they already
      // use immutable caching with unique filenames).
      {
        source: "/((?!controller|api|uploads|_next).*)",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
