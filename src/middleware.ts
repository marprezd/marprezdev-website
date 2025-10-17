// src/middleware.ts
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

// Configuration for the middleware
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(es|tr|en|fr)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!api|_next|_vercel|auth|.*\\..*).*)",
  ],
}
