export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  // Try to get token from cookies first
  let token = request.cookies.get('token')?.value;

  // Fallback to Cookie header if cookies are not available
  if (!token) {
    const cookieHeader = request.headers.get('cookie');
    console.log('Verify - Cookie header received:', cookieHeader);
    if (cookieHeader && cookieHeader.includes('token=')) {
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : null;
    }
  }

  console.log('Verify - Token received:', token);

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const result = verifyToken(token);
  console.log('Verify - Token verification result:', result);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status || 401 });
  }

  return NextResponse.json({ user: result.user }, { status: 200 });
}