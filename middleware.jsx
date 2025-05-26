import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Middleware running in runtime:', process.env.NEXT_RUNTIME || 'Node.js');
  const token = req.cookies.get('token')?.value;

  if (!token || token === 'undefined' || token === 'null') {
    console.log('Middleware - No valid token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Use environment variable for the app's base URL
  const APP_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';
  const verifyUrl = new URL('/api/auth/verify', APP_URL);

  console.log('Middleware - Token:', token);
  console.log('Middleware - Fetching:', verifyUrl.toString());

  // Perform the fetch request
  return fetch(verifyUrl, {
    method: 'GET',
    headers: {
      'Cookie': `token=${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log('Middleware - Verify response status:', response.status);
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
      console.error('Middleware - Error verifying token:', error);
      console.log('Middleware - Redirecting to /login due to:', error.message || 'Unknown fetch error');
      return NextResponse.redirect(new URL('/login', req.url));
    });
}

export const config = {
  matcher: ['/dashboard/:path*', '/shifts/:path*', '/time-tracking/:path*', '/employees/:path*', '/company/:path*', '/profile/:path*'],
};