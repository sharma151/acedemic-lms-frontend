export interface JwtPayload {
  jti: string;
  sub: string;
  email: string;
  role: string;
  roleId: string;
  tenantId: string | null;
  iat: number;
  exp: number;
}

/**
 * Lightweight, dependency-free JWT parser designed specifically 
 * for the Next.js Edge Runtime (used in middleware).
 */
export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // atob is globally available in Node >= 16 and Edge Runtimes
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    return null;
  }
}
