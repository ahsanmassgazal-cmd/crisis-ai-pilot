import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal next calls
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // Access Code Gate verification
  const demoAccessCode = process.env.DEMO_ACCESS_CODE || "SIGMAMAX2026";
  const hasAccessCookie = request.cookies.get("crisis_pilot_access")?.value === "granted";

  const isAccessPage = pathname.includes("/access");

  // Determine locale from path or default
  const pathLocale = pathname.split("/")[1];
  const locale = routing.locales.includes(pathLocale as any) ? pathLocale : routing.defaultLocale;

  // If gate is enabled and user doesn't have cookie, redirect to /access (unless already on /access)
  if (demoAccessCode && !hasAccessCookie && !isAccessPage) {
    const accessUrl = new URL(`/${locale}/access`, request.url);
    const redirectResponse = NextResponse.redirect(accessUrl);
    redirectResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirectResponse;
  }

  // Process next-intl locale routing
  const response = intlMiddleware(request);

  // Enforce noindex, nofollow on every response
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
