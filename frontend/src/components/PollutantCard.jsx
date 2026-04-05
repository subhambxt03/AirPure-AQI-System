import React from 'react';

export default function PollutantCard({ name, value, unit = 'µg/m³' }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-400">{name}</p>
      <p className="font-bold text-lg text-gray-900 dark:text-white">{value} {unit}</p>
    </div>
  );
}