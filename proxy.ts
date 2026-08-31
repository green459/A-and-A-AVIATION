import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

// Thin guard only: bounces obviously-logged-out visitors away from
// /controller before a render even starts. It deliberately does NOT touch
// the database — every server action/page under (dashboard) calls
// requireAdmin() itself, which is the authoritative check. See the Next.js
// proxy docs: "Always verify authentication and authorization inside each
// Server Function rather than relying on Proxy alone."
const PUBLIC_CONTROLLER_PATHS = [
  "/controller/login",
  "/controller/forgot-password",
  "/controller/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_CONTROLLER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublic) {
    return NextResponse.next();
  }

  const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);
  if (!hasSessionCookie) {
    const loginUrl = new URL("/controller/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/controller/:path*",
};
