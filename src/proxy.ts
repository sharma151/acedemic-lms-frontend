import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const token = request.cookies.get("lms_access_token")?.value;

  // Extract the tenant slug from the hostname
  // Example: oxford.lms.com -> 'oxford', app.lms.com -> 'app' (root)
  // Local testing: oxford.lvh.me:3000 -> 'oxford'
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "lms.com";

  let currentHost = hostname.replace(`.${rootDomain}`, "");

  if (isLocalhost) {
    currentHost = hostname.split(":")[0].replace(".lvh.me", "");
  }

  const isRootOrAdmin =
    currentHost === "app" ||
    currentHost === "admin" ||
    currentHost === hostname.split(":")[0];

  const isAuthPage =
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register") ||
    url.pathname.startsWith("/forgot-password");

  // Pass through API, static files, next static files
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // We still want to add tenant headers to auth pages if accessed via a tenant subdomain
    const response = NextResponse.next();
    if (!isRootOrAdmin) {
      response.headers.set("x-tenant-slug", currentHost);
      response.headers.set("x-tenant-domain", hostname);
    }
    return response;
  }

  // Not an auth page and not static -> Must be authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Rewrite logic
  let rewriteUrl = new URL(url.pathname, request.url);

  if (isRootOrAdmin) {
    // Route to super-admin or root pages
    rewriteUrl.pathname = url.pathname === "/" ? "/tenants" : url.pathname;
  } else {
    // Route to tenant-portal pages
    rewriteUrl.pathname = url.pathname === "/" ? "/dashboard" : url.pathname;
  }

  // Inject tenant context into headers for downstream use
  const response = NextResponse.rewrite(rewriteUrl);
  if (!isRootOrAdmin) {
    response.headers.set("x-tenant-slug", currentHost);
    response.headers.set("x-tenant-domain", hostname);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
