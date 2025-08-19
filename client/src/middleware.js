import { NextResponse } from "next/server";

/**
 * Auth middleware based on a cookie token.
 * Because middleware runs on the server/edge, it cannot access localStorage.
 * Ensure the client mirrors the token into a cookie named `userID` after login.
 */
export function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  // Read token from cookies; set by the client on successful login
  const token = cookies.get("userID")?.value;

  // Define protected routes; extend as needed
  const protectedRoutes = [
    "/",
    "/expenses",
    "/expenses/add",
    "/incomes",
    "/incomes/add",
  ];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If navigating to a protected route without a token, redirect to /login
  if (isProtected && !token) {
    const url = nextUrl.clone();
    url.pathname = "/login";
    // Optional: preserve intended destination
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // If user is already authenticated and tries to access /login, redirect home
  if (pathname.startsWith("/login") && token) {
    const url = nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Exclude Next.js internals, static assets, and common image/static files
export const config = {
  matcher: [
    // Run for all routes except:
    // - _next (Next.js internals)
    // - static files (by extension)
    // - favicon
    // - API routes can be excluded if desired (uncomment to exclude /api)
    // "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
