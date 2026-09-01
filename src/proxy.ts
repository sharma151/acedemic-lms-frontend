import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Extract the tenant slug from the hostname
  // Example: oxford.lms.com -> 'oxford', app.lms.com -> 'app' (root)
  // Local testing: oxford.lvh.me:3000 -> 'oxford'
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lms.com';
  
  let currentHost = hostname.replace(`.${rootDomain}`, '');
  
  if (isLocalhost) {
    currentHost = hostname.split(':')[0].replace('.lvh.me', '');
  }

  const isRootOrAdmin = currentHost === 'app' || currentHost === 'admin' || currentHost === hostname.split(':')[0];

  // Pass through API, static files, next static files
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.includes('.') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register') ||
    url.pathname.startsWith('/forgot-password')
  ) {
    // We still want to add tenant headers to auth pages if accessed via a tenant subdomain
    const response = NextResponse.next();
    if (!isRootOrAdmin) {
      response.headers.set('x-tenant-slug', currentHost);
      response.headers.set('x-tenant-domain', hostname);
    }
    return response;
  }

  // Rewrite logic
  let rewriteUrl = new URL(url.pathname, request.url);

  if (isRootOrAdmin) {
    // Route to super-admin or root pages
    rewriteUrl.pathname = `/super-admin${url.pathname === '/' ? '/tenants' : url.pathname}`;
  } else {
    // Route to tenant-portal pages
    rewriteUrl.pathname = `/tenant-portal${url.pathname === '/' ? '/dashboard' : url.pathname}`;
  }

  // Inject tenant context into headers for downstream use
  const response = NextResponse.rewrite(rewriteUrl);
  if (!isRootOrAdmin) {
    response.headers.set('x-tenant-slug', currentHost);
    response.headers.set('x-tenant-domain', hostname);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
