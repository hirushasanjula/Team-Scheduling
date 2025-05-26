export const runtime = 'nodejs';
  import { NextResponse } from 'next/server';
  import { auth } from '@/lib/auth';
  import { connectDB } from '@/lib/db';
  import TimeEntry from '@/models/TimeEntry';
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
        query.userId = session.user._id; // Changed from id to _id
      } else if (userId) {
        query.userId = userId;
      }
      
      const timeEntries = await TimeEntry.find(query)
        .populate('userId', 'name')
        .populate('shiftId', 'title startTime endTime')
        .sort({ createdAt: -1 });
      
      return NextResponse.json(timeEntries);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch time entries', details: error.message }, { status: 500 });
    }
  }

  export async function POST(request) {
    try {
      const session = await auth();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const { shiftId, action, notes } = await request.json();
      
      await connectDB();
      
      const shift = await Shift.findById(shiftId);
      if (!shift || shift.companyId.toString() !== session.user.companyId) {
        return NextResponse.json({ error: 'Invalid shift' }, { status: 400 });
      }
      
      if (action === 'clock-in') {
        const existingEntry = await TimeEntry.findOne({
          userId: session.user._id, // Changed from id to _id
          shiftId,
          status: 'ACTIVE',
        });
        
        if (existingEntry) {
          return NextResponse.json({ error: 'Already clocked in' }, { status: 400 });
        }
        
        const timeEntry = await TimeEntry.create({
          userId: session.user._id,
          shiftId,
          clockIn: new Date(),
          companyId: session.user.companyId,
          notes,
        });
        
        return NextResponse.json(timeEntry, { status: 201 });
      }
      
      if (action === 'clock-out') {
        const timeEntry = await TimeEntry.findOne({
          userId: session.user._id,
          shiftId,
          status: 'ACTIVE',
        });
        
        if (!timeEntry) {
          return NextResponse.json({ error: 'No active time entry found' }, { status: 400 });
        }
        
        timeEntry.clockOut = new Date();
        timeEntry.notes = notes || timeEntry.notes;
        await timeEntry.save();
        
        return NextResponse.json(timeEntry);
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to process time entry', details: error.message }, { status: 500 });
    }
  }