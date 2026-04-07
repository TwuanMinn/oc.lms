import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { GET: _GET, POST: _POST } = toNextJsHandler(auth);

/**
 * Wraps auth responses to set a lightweight `user-role` cookie.
 * This cookie is read by middleware for instant role-based routing,
 * eliminating the self-referential fetch() anti-pattern.
 */
async function withRoleCookie(request: Request, handler: (req: Request) => Promise<Response>): Promise<Response> {
  const response = await handler(request);
  const url = new URL(request.url);

  // Set role cookie on session endpoints
  if (url.pathname.includes("/get-session") || url.pathname.includes("/sign-in")) {
    try {
      const cloned = response.clone();
      const body = await cloned.json();
      const role = body?.user?.role;

      if (role) {
        const headers = new Headers(response.headers);
        headers.append(
          "Set-Cookie",
          `user-role=${role}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
        );
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }
    } catch {
      // Not JSON or no role — pass through
    }
  }

  // Clear role cookie on sign-out
  if (url.pathname.includes("/sign-out")) {
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `user-role=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
}

export async function GET(request: Request) {
  return _GET(request);
}

export async function POST(request: Request) {
  return _POST(request);
}
