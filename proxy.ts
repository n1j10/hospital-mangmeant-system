import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth-token')?.value;

  // If user has auth token and tries to access login or register, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // If user is not authenticated and tries to access dashboard or root app routes, redirect to login
  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/patients') ||
    pathname.startsWith('/doctors') ||
    pathname.startsWith('/departments') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/consultations') ||
    pathname.startsWith('/admissions') ||
    pathname.startsWith('/pharmacy');

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
