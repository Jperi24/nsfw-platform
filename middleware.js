// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protected routes for authenticated users
  if (
    request.nextUrl.pathname.startsWith('/account') ||
    request.nextUrl.pathname.startsWith('/membership')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Premium content protection
  if (request.nextUrl.pathname.includes('/premium')) {
    if (!token || token.membershipStatus !== 'premium') {
      return NextResponse.redirect(new URL('/membership', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/account/:path*', 
    '/membership/:path*',
    '/models/:path*/premium/:path*',
  ],
};