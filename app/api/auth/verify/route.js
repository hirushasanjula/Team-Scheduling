export const runtime = 'nodejs';

  import { NextResponse } from 'next/server';
  import { verifyToken } from '@/lib/auth';

  export async function GET(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const result = verifyToken(token);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ user: result.user }, { status: 200 });
  }