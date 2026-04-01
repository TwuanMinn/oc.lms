import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/courses", "/pricing", "/api/auth", "/api/trpc", "/api/inngest", "/api/health"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based sub-path guards: verify role via session API (not spoofable cookie)
  if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/teacher")) {
    try {
      const sessionRes = await fetch(new URL("/api/auth/get-session", request.url), {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      });

      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/dashboard/student", request.url));
      }

      const session = await sessionRes.json();
      const role = session?.user?.role as string | undefined;

      if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/student", request.url));
      }

      if (pathname.startsWith("/dashboard/teacher") && role !== "TEACHER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/student", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
