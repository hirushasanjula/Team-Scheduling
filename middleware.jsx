import { NextResponse } from 'next/server';

export const runtime = 'experimental-edge';

export function middleware(req) {
  console.log('Middleware running for:', req.nextUrl.pathname);
  
  const token = req.cookies.get('token')?.value;
  console.log('Middleware - Token exists:', !!token);

  // If no token, redirect to login
  if (!token || token === 'undefined' || token === 'null') {
    console.log('Middleware - No valid token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Get the correct origin/base URL
  const protocol = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('host');
  const origin = process.env.NEXTAUTH_URL || process.env.RENDER_EXTERNAL_URL || `${protocol}://${host}`;
  
  console.log('Middleware - Using origin:', origin);
  
  // Create verify URL
  const verifyUrl = `${origin}/api/auth/verify`;
  console.log('Middleware - Verify URL:', verifyUrl);

  return fetch(verifyUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}`,
      'User-Agent': 'NextJS-Middleware',
      // Add host header to ensure proper routing
      'Host': host,
    },
  })
    .then(async (response) => {
      console.log('Middleware - Verify response status:', response.status);
      
      if (!response.ok) {
        console.log('Middleware - Response not ok, status:', response.status);
        const errorText = await response.text();
        console.log('Middleware - Error response:', errorText);
        throw new Error(`Verification failed: ${response.status}`);
      }
      
      return response.json();
    })
    .then((result) => {
      console.log('Middleware - Verification successful:', !!result.user);
      
      if (!result || result.error || !result.user) {
        console.log('Middleware - No user in result, redirecting');
        return NextResponse.redirect(new URL('/login', req.url));
      }
      
      // Allow the request to continue
      return NextResponse.next();
    })
    .catch((error) => {
      console.error('Middleware - Verification error:', error.message);
      return NextResponse.redirect(new URL('/login', req.url));
    });
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/shifts/:path*', 
    '/time-tracking/:path*', 
    '/employees/:path*', 
    '/company/:path*', 
    '/profile/:path*'
  ],
};