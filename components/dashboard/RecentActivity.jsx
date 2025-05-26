'use client';
import { useState, useEffect } from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mr-3`}></div>
              <span className="text-gray-600">{activity.message}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;