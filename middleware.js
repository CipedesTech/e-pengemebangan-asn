/* eslint-disable prefer-const */
import { NextResponse } from 'next/server';

export async function middleware(req) {
  if (req.headers.get('authorization') && req.headers.get('authorization').split(' ')[0] === 'Bearer') {
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${req.headers.get('authorization').split(' ')[1]}`,
      },
      redirect: 'follow',
    };
    const auth = await fetch(`${process.env.API_URL}/api/auth/me`, requestOptions);
    if (auth.status !== 200) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }
    return NextResponse.next();
  }
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
}

export const config = {
  matcher: [
    '/api/pns/:path*',
    '/api/master/:path*',
    '/api/diklat/:path*',
  ],
};
