import React from 'react';

export default function EmptyState({ title, message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
      {Icon && <Icon className="w-12 h-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {message && <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">{message}</p>}
    </div>
  );
}
