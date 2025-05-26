export const runtime = 'nodejs';
  import { auth } from '@/lib/auth';
  import { connectDB } from '@/lib/db';
  import Company from '@/models/Company';
  import { NextResponse } from 'next/server';

  export async function PUT(request) {
    try {
      const session = await auth();
      if (!session || !session.user || session.user.role !== 'MANAGER') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const { companyId, name, email, timezone, workingHoursStart, workingHoursEnd } = await request.json();

      if (companyId !== session.user.companyId) {
        return NextResponse.json({ message: 'Forbidden: Cannot update another company' }, { status: 403 });
      }

      if (!name || name.length > 100) {
        return NextResponse.json({ message: 'Company name is required and must be 100 characters or less' }, { status: 400 });
      }
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
      }
      if (timezone && !/^[A-Za-z_/]+$/.test(timezone)) {
        return NextResponse.json({ message: 'Invalid timezone format' }, { status: 400 });
      }
      if (
        (workingHoursStart && !/^\d{2}:\d{2}$/.test(workingHoursStart)) ||
        (workingHoursEnd && !/^\d{2}:\d{2}$/.test(workingHoursEnd))
      ) {
        return NextResponse.json({ message: 'Invalid time format (e.g., 09:00)' }, { status: 400 });
      }

      await connectDB();
      const company = await Company.findById(companyId);
      if (!company) {
        return NextResponse.json({ message: 'Company not found' }, { status: 404 });
      }

      const existingCompany = await Company.findOne({ email, _id: { $ne: companyId } });
      if (existingCompany) {
        return NextResponse.json({ message: 'Email already in use by another company' }, { status: 400 });
      }

      company.name = name;
      company.email = email;
      company.settings = {
        timezone: timezone || company.settings?.timezone || 'UTC',
        workingHours: {
          start: workingHoursStart || company.settings?.workingHours?.start || '09:00',
          end: workingHoursEnd || company.settings?.workingHours?.end || '17:00',
        },
      };

      await company.save();
      return NextResponse.json({ message: 'Company updated successfully' }, { status: 200 });
    } catch (error) {
      console.error('Update company error:', error);
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
  }