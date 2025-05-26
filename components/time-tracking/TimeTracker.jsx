'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Adjusted path to match your imports

const TimeTracker = ({ shifts, session }) => {
  const [activeShift, setActiveShift] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch('/api/time-entries', {
        credentials: 'include', // Ensure cookies are sent
      });
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data);

        // Check for active shift
        const active = data.find(entry => entry.status === 'ACTIVE');
        if (active) {
          setActiveShift({
            shiftId: active.shiftId._id,
            startTime: active.clockIn,
            entryId: active._id,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const handleClockAction = async (shiftId, action) => {
    setLoading(true);
    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shiftId,
          action,
          notes,
        }),
        credentials: 'include', // Ensure cookies are sent
      });

      if (response.ok) {
        const data = await response.json();
        if (action === 'clock-in') {
          setActiveShift({
            shiftId,
            startTime: new Date(),
            entryId: data._id,
          });
        } else {
          setActiveShift(null);
        }
        setNotes('');
        await fetchTimeEntries();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getElapsedTime = (startTime) => {
    const elapsed = currentTime - new Date(startTime);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isShiftActive = (shift) => {
    const now = new Date();
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);
    return now >= start && now <= end;
  };

  const isShiftClockedIn = (shiftId) => {
    return activeShift && activeShift.shiftId === shiftId;
  };

  const todayShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.startTime).toDateString();
    const today = new Date().toDateString();
    return shiftDate === today;
  });

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.clockIn).toDateString();
      return entryDate === today;
    });
  };

  const isManager = session?.user?.role === 'MANAGER';

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="text-gray-600">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        {activeShift && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <div className="text-sm text-green-800 mb-1">Currently Clocked In</div>
            <div className="text-2xl font-mono font-bold text-green-900">
              {getElapsedTime(activeShift.startTime)}
            </div>
          </div>
        )}
      </div>

      {/* Today's Shifts */}
      {todayShifts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No shifts scheduled for today.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">
            {isManager ? "Today's All Shifts" : "Today's Shifts"}
          </h2>
          {todayShifts.map((shift) => (
            <div key={shift._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{shift.title}</h3>
                    {isManager && shift.assignedTo && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {shift.assignedTo.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(shift.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} - {new Date(shift.endTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {shift.location && (
                    <p className="text-sm text-gray-500">📍 {shift.location}</p>
                  )}
                  {isManager && shift.assignedTo && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Assigned to:</span> {shift.assignedTo.name}
                      {shift.assignedTo.email && (
                        <span className="text-gray-500"> ({shift.assignedTo.email})</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    isShiftActive(shift) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isShiftActive(shift) ? 'Active' : 'Inactive'}
                  </div>
                  {isShiftClockedIn(shift._id) && (
                    <div className="text-sm text-green-600 font-medium">
                      Clocked In: {getElapsedTime(activeShift.startTime)}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* Only show clock in/out controls for employees or if manager is assigned to this shift */}
                {(!isManager || (isManager && shift.assignedTo?._id === session?.user?._id)) && (
                  <>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      maxLength={500}
                    />
                    
                    <div className="flex space-x-3">
                      {!isShiftClockedIn(shift._id) ? (
                        <Button
                          onClick={() => handleClockAction(shift._id, 'clock-in')}
                          disabled={loading || activeShift !== null}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                        >
                          {loading ? 'Processing...' : 'Clock In'}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleClockAction(shift._id, 'clock-out')}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                        >
                          {loading ? 'Processing...' : 'Clock Out'}
                        </Button>
                      )}
                    </div>
                  </>
                )}
                
                {/* Show read-only message for managers viewing other employees' shifts */}
                {isManager && shift.assignedTo?._id !== session?.user?._id && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      This shift is assigned to {shift.assignedTo.name}. Only the assigned employee can clock in/out.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Today's Time Entries */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">
          {isManager ? "Today's All Time Entries" : "Today's Time Entries"}
        </h2>
        {getTodayEntries().length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No time entries for today.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {getTodayEntries().map((entry) => (
              <div key={entry._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {entry.shiftId?.title || 'Unknown Shift'}
                      </h4>
                      {isManager && entry.userId && ( // Changed from employeeId to userId to match schema
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {entry.userId.name}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Clock In: {new Date(entry.clockIn).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {entry.clockOut && (
                        <span className="ml-4">
                          Clock Out: {new Date(entry.clockOut).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    {isManager && entry.userId && ( // Changed from employeeId to userId
                      <p className="text-sm text-gray-500 mt-1">
                        Employee: {entry.userId.name}
                        {entry.userId.email && (
                          <span className="text-gray-400"> ({entry.userId.email})</span>
                        )}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      entry.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.status === 'ACTIVE' ? 'Active' : 'Completed'}
                    </div>
                    {entry.clockOut && (
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {Math.round(
                          (new Date(entry.clockOut) - new Date(entry.clockIn)) / (1000 * 60 * 60) * 100
                        ) / 100}h
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;