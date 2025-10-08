/**
 * Next.js Middleware
 * Protects authenticated routes and refreshes user sessions
 */

import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Update session (refresh if needed)
  const response = await updateSession(request);

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/receipts', '/budgets', '/household', '/settings'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath) {
    const {
      data: { user },
    } = await (await updateSession(request)).json();

    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Auth routes - redirect to dashboard if already logged in
  const authPaths = ['/auth/login', '/auth/signup'];
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isAuthPath) {
    const {
      data: { user },
    } = await (await updateSession(request)).json();

    if (user) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
