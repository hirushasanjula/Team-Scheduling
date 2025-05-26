import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Middleware running in runtime:', process.env.NEXT_RUNTIME || 'Node.js');
  const token = req.cookies.get('token')?.value;

  if (!token || token === 'undefined' || token === 'null') {
    console.log('Middleware - No valid token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const origin = req.headers.get('origin') || process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';
  const verifyUrl = new URL('/api/auth/verify', origin);

  console.log('Middleware - Token:', token);
  console.log('Middleware - Fetching:', verifyUrl.toString());

  return fetch(verifyUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      console.log('Middleware - Verify response status:', response.status);
      if (!response.ok) {
        console.log('Middleware - Response headers:', Object.fromEntries(response.headers));
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log('Middleware - Token Verification Result:', result);
      if (!result || result.error) {
        const error = result?.error || 'Invalid or missing token verification result';
        console.log('Middleware - Redirecting to /login due to:', error);
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    })
    .catch((error) => {
      console.error('Middleware - Error verifying token:', error.stack || error.message);
      console.log('Middleware - Redirecting to /login due to:', error.message);
      return NextResponse.redirect(new URL('/login', req.url));
    });
}

export const config = {
  matcher: ['/dashboard/:path*', '/shifts/:path*', '/time-tracking/:path*', '/employees/:path*', '/company/:path*', '/profile/:path*'],
};