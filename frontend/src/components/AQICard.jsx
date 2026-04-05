import React from 'react';

export default function AQICard({ aqi, status, color }) {
  return (
    <div className="text-center p-6 rounded-lg" style={{ backgroundColor: color + '20' }}>
      <div className="text-6xl font-bold" style={{ color: color }}>{aqi}</div>
      <p className="text-xl mt-2 font-semibold">{status}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Air Quality Index</p>
    </div>
  );
}