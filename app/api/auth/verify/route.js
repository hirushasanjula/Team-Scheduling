export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  let token = request.cookies.get('token')?.value;

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
    console.log('Verify - No token provided, returning 401');
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const result = verifyToken(token);
  console.log('Verify - Token verification result:', result);

  if (result.error) {
    console.log('Verify - Token verification failed, returning 401:', result.error);
    return NextResponse.json({ error: result.error }, { status: result.status || 401 });
  }

  console.log('Verify - Token verified successfully, user:', result.user);
  return NextResponse.json({ user: result.user }, { status: 200 });
}