// Split out from session.ts so proxy.ts can read the cookie name without
// pulling the Prisma client (and its DB driver) into the proxy bundle.
export const SESSION_COOKIE_NAME = "admin_session";
