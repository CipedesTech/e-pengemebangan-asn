import { NextResponse } from 'next/server';

export async function middleware(req) {
  if (req.headers.get('authorization') && req.headers.get('authorization').split(' ')[0] === 'Bearer') {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${req.headers.get('authorization').split(' ')[1]}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };
    const auth = await fetch(`${process.env.API_URL}/api/auth/me`, requestOptions);
    if (auth.status !== 200) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/pns/:path*',
  ],
};
