import { redirect } from 'next/navigation';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { connectDB } from '@/lib/db';
import TimeEntry from '@/models/TimeEntry';
import Shift from '@/models/Shift';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  // Get token from cookies (await the cookies() call)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';

  if (!token) {
    redirect('/login');
  }

  const session = verifyToken(token);

  if (!session || session.error) {
    redirect('/login');
  }

  console.log('Session in DashboardPage:', session); // Debug

  await connectDB();
  let recentActivities = [];
  try {
    let query = { companyId: session.user.companyId };
    if (session.user.role === 'EMPLOYEE') {
      query.userId = session.user._id;
    }

    const timeEntries = await TimeEntry.find(query)
      .populate('userId', 'name')
      .populate('shiftId', 'title startTime endTime')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    recentActivities = timeEntries.map((entry) => {
      const userName = entry.userId?.name || 'Unknown';
      const shiftTitle = entry.shiftId?.title || 'Shift';
      if (entry.status === 'ACTIVE') {
        return {
          message: `${userName} clocked in for ${shiftTitle} at ${new Date(entry.clockIn).toLocaleTimeString()}`,
          color: 'green',
        };
      } else if (entry.clockOut) {
        const duration = ((new Date(entry.clockOut) - new Date(entry.clockIn)) / (1000 * 60 * 60)).toFixed(1);
        return {
          message: `${userName} completed ${shiftTitle} (${duration} hours)`,
          color: 'yellow',
        };
      }
      return null;
    }).filter(Boolean);

    if (recentActivities.length < 5) {
      const shifts = await Shift.find({
        companyId: session.user.companyId,
        ...(session.user.role === 'EMPLOYEE' ? { assignedTo: session.user._id } : {}),
      })
        .populate('assignedTo', 'name')
        .sort({ createdAt: -1 })
        .limit(5 - recentActivities.length)
        .lean();

      const shiftActivities = shifts.map((shift) => ({
        message: `${shift.assignedTo?.name || 'Unknown'} was assigned to ${shift.title}`,
        color: 'blue',
      }));

      recentActivities = [...recentActivities, ...shiftActivities].slice(0, 5);
    }
  } catch (error) {
    console.error('Failed to fetch recent activities:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-gray-600">
            {session.user.companyName} - {session.user.role}
          </p>
        </div>

        <div className="flex space-x-3 p-6">
          {session.user.role === 'MANAGER' && (
            <>
              <Link href="/employees/new">
                <Button>Add Employee</Button>
              </Link>
              <Link href="/shifts/new">
                <Button>Create Shift</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <DashboardStats
        userRole={session.user.role}
        userId={session.user._id}
        companyId={session.user.companyId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivities} />

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link href="/shifts" className="block">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">View All Shifts</div>
                <div className="text-sm text-gray-600">Manage and view shift schedules</div>
              </div>
            </Link>

            {session.user.role === 'MANAGER' && (
              <Link href="/employees" className="block">
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Manage Employees</div>
                  <div className="text-sm text-gray-600">Add and manage team members</div>
                </div>
              </Link>
            )}

            <Link href="/time-tracking" className="block">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Time Tracking</div>
                <div className="text-sm text-gray-600">Clock in/out and view hours</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}