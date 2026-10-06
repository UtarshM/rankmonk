import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/aeo",
  "/geo",
  "/competitors",
  "/traffic",
  "/content-gaps",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current route requires authentication
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const authCookie = request.cookies.get("rankmonk_auth")?.value;
    
    // Also check for standard Supabase SSR cookies (sb-<ref>-auth-token or sb-access-token)
    const hasSbAuth = request.cookies.getAll().some(
      (c) => c.name.startsWith("sb-") && (c.name.includes("-auth-token") || c.name.includes("access-token"))
    );

    if (!authCookie && !hasSbAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/aeo/:path*",
    "/geo/:path*",
    "/competitors/:path*",
    "/traffic/:path*",
    "/content-gaps/:path*",
  ],
};
