import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";

/**
 * Guards all /admin/* routes except /admin/login.
 *
 * If the session cookie is missing or invalid we redirect to /admin/login
 * preserving the originally requested path as `?next=` so the user lands
 * back where they were after a successful login.
 *
 * Runs on the edge — `jose` works in edge runtime, so no Node runtime
 * opt-in is needed here.
 *
 * Note: in Next 16 the file-convention `middleware.ts` was renamed to
 * `proxy.ts`. The exported function name is now `proxy`; behaviour is
 * identical to the old middleware API.
 */
export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Public admin sub-routes (login page itself)
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySession(token);

  if (valid) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  // Remember the destination so we can bounce the user back after auth.
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Match every /admin route except static assets and the API routes that
  // do their own auth check. The matcher does NOT trigger for the public
  // `/api/admin/*` endpoints — those validate the session themselves so
  // they can return proper 401 JSON rather than HTML redirects.
  matcher: ["/admin/:path*"],
};
