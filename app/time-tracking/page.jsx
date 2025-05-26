'use client';
import { useState, useEffect } from 'react';
import TimeTracker from '@/components/time-tracking/TimeTracker';

export default function TimeTrackingPage() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('loading');
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check session by calling /api/auth/verify
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include', // Send cookies with the request
        });

        if (response.ok) {
          const data = await response.json();
          setSession({ user: data.user });
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setSession(null);
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchShifts();
    }
  }, [status]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shifts', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setShifts(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch shifts');
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
      setError('Failed to fetch shifts');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600">
            Please sign in to access time tracking.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchShifts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Time Tracking
          </h1>
          <p className="text-gray-600">
            Clock in and out of your shifts, and track your working hours.
          </p>
        </div>

        <TimeTracker shifts={shifts} session={session} />
      </div>
    </div>
  );
}