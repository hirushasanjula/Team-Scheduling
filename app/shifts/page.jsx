import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Shift from '@/models/Shift';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getShifts(companyId, userRole, userId) {
  await connectDB();
  
  let query = { companyId };
  
  if (userRole === 'EMPLOYEE') {
    query.assignedTo = userId;
  }
  
  const shifts = await Shift.find(query)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name')
    .sort({ startTime: 1 })
    .lean();
    
  return JSON.parse(JSON.stringify(shifts));
}

export default async function ShiftsPage({ searchParams }) {
  console.log('Auth function:', auth); // Debug
  const session = await auth();
  console.log('Session:', session); // Debug
  
  if (!session) {
    redirect('/login');
  }

  const shifts = await getShifts(session.user.companyId, session.user.role, session.user._id);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingShifts = shifts.filter(shift => new Date(shift.startTime) > new Date());
  const pastShifts = shifts.filter(shift => new Date(shift.startTime) <= new Date());

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {session.user.role === 'MANAGER' ? 'All Shifts' : 'My Shifts'}
        </h1>
        {session.user.role === 'MANAGER' && (
          <Link href="/shifts/new">
            <Button>Create Shift</Button>
          </Link>
        )}
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Shifts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {upcomingShifts.length > 0 ? upcomingShifts.map((shift) => (
            <div key={shift._id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {shift.title}
                    </h3>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}>
                      {shift.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span>{formatDateTime(shift.startTime)} - {formatDateTime(shift.endTime)}</span>
                    {shift.location && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{shift.location}</span>
                      </>
                    )}
                  </div>
                  {session.user.role === 'MANAGER' && (
                    <p className="mt-1 text-sm text-gray-600">
                      Assigned to: {shift.assignedTo.name}
                    </p>
                  )}
                  {shift.description && (
                    <p className="mt-2 text-sm text-gray-700">{shift.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {session.user.role === 'MANAGER' && (
                    <Link href={`/shifts/${shift._id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  )}
                  <Link href={`/time-tracking?shiftId=${shift._id}`}>
                    <Button variant="outline" size="sm">
                      Time Track
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming shifts scheduled.</p>
              {session.user.role === 'MANAGER' && (
                <Link href="/shifts/new" className="mt-2 inline-block">
                  <Button>Create your first shift</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Past Shifts */}
      {pastShifts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Past Shifts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pastShifts.slice(0, 10).map((shift) => (
              <div key={shift._id} className="p-6 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {shift.title}
                      </h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}>
                        {shift.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <span>{formatDateTime(shift.startTime)} - {formatDateTime(shift.endTime)}</span>
                      {shift.location && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{shift.location}</span>
                        </>
                      )}
                    </div>
                    {session.user.role === 'MANAGER' && (
                      <p className="mt-1 text-sm text-gray-600">
                        Assigned to: {shift.assignedTo.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.user.role === 'MANAGER' && (
                      <Link href={`/shifts/${shift._id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    )}
                    <Link href={`/time-tracking?shiftId=${shift._id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}