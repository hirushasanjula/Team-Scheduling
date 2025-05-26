import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Middleware running in runtime:', process.env.NEXT_RUNTIME || 'Node.js');
  const token = req.cookies.get('token')?.value;

  if (!token || token === 'undefined' || token === 'null') {
    console.log('Middleware - No valid token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Call the API route to verify the token
  return fetch(new URL('/api/auth/verify', req.url), {
    method: 'GET',
    headers: {
      'Cookie': `token=${token}`,
    },
  })
    .then((response) => response.json())
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
      console.error('Middleware - Error verifying token:', error);
      console.log('Middleware - Redirecting to /login due to:', error.message);
      return NextResponse.redirect(new URL('/login', req.url));
    });
}

export const config = {
  matcher: ['/dashboard/:path*', '/shifts/:path*', '/time-tracking/:path*', '/employees/:path*', '/company/:path*', '/profile/:path*'],
};