export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Company from '@/models/Company';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { companyName, companyEmail, email, password, managerName, role } = await request.json();

    // Input validation
    if (!companyName || !companyEmail || !email || !password || !managerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(companyEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (role !== 'MANAGER') {
      return NextResponse.json({ error: 'Invalid role for company registration' }, { status: 400 });
    }

    await connectDB();

    // Check for existing company or user
    const [existingCompany, existingUser] = await Promise.all([
      Company.findOne({ email: companyEmail }),
      User.findOne({ email }),
    ]);
    if (existingCompany) {
      return NextResponse.json({ error: 'Company email already exists' }, { status: 400 });
    }
    if (existingUser) {
      return NextResponse.json({ error: 'User email already exists' }, { status: 400 });
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      email: companyEmail,
    });

    // Create manager user
    const manager = await User.create({
      email,
      password,
      name: managerName,
      role: 'MANAGER',
      companyId: company._id,
      isActive: true,
    });

    // Generate JWT
    const token = generateToken({
      _id: manager._id,
      email: manager.email,
      name: manager.name,
      role: manager.role,
      companyId: company._id,
      companyName: company.name,
    });

    return NextResponse.json(
      {
        message: 'Company and manager registered successfully',
        companyId: company._id,
        userId: manager._id,
      },
      {
        status: 201,
        headers: {
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
        },
      }
    );
  } catch (error) {
    console.error('POST /api/companies/register error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register company' }, { status: 500 });
  }
}