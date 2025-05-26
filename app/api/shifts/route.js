export const runtime = 'nodejs';
  import { NextResponse } from 'next/server';
  import { auth } from '@/lib/auth';
  import { connectDB } from '@/lib/db';
  import Shift from '@/models/Shift';

  export async function GET(request) {
    try {
      const session = await auth();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      
      await connectDB();
      
      let query = { companyId: session.user.companyId };
      
      if (session.user.role === 'EMPLOYEE') {
        query.assignedTo = session.user._id; // Changed from id to _id
      } else if (userId) {
        query.assignedTo = userId;
      }
      
      const shifts = await Shift.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name')
        .sort({ startTime: 1 });
      
      return NextResponse.json(shifts);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
    }
  }

  export async function POST(request) {
    try {
      const session = await auth();
      if (!session || session.user.role !== 'MANAGER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const shiftData = await request.json();
      
      await connectDB();
      
      const shift = await Shift.create({
        ...shiftData,
        companyId: session.user.companyId,
        createdBy: session.user._id, // Changed from id to _id
      });
      
      const populatedShift = await Shift.findById(shift._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');
      
      return NextResponse.json(populatedShift, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
    }
  }