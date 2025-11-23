import React from 'react';

export default function StatCard({ icon, title, value }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-3xl text-blue-500">{icon}</div>
    </div>
  );
}
