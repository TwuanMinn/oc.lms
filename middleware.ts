import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/courses", "/pricing", "/api/auth", "/api/trpc", "/api/inngest", "/api/health", "/help"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/images")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based guards using a lightweight role cookie.
  // The "user-role" cookie is set by the auth session callback (see lib/auth.ts).
  // Actual enforcement happens server-side in tRPC procedures — this is just
  // a fast-path UX guard to redirect users to the correct dashboard.
  // This eliminates the self-referential fetch() anti-pattern that was
  // causing performance bottlenecks and potential infinite loops.
  if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/teacher")) {
    const roleCookie = request.cookies.get("user-role");
    const role = roleCookie?.value;

    // If no role cookie yet, allow through — the page-level auth will
    // redirect if needed, and the tRPC procedures enforce server-side.
    if (role) {
      if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/student", request.url));
      }

      if (pathname.startsWith("/dashboard/teacher") && role !== "TEACHER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/student", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
