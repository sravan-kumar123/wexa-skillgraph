import React from 'react';
import { Link } from 'react-router-dom';

export default function StatCard({ title, value, icon: Icon, color = "blue", to }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    green: "bg-green-50 text-green-600 group-hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
    red: "bg-red-50 text-red-600 group-hover:bg-red-100",
    teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-100",
  };

  const innerContent = (
    <>
      <div className={`p-4 rounded-lg transition-colors duration-200 ${colorClasses[color] || colorClasses.blue}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </>
  );

  const baseClasses = "bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4";

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} hover:shadow-md hover:border-blue-200 transition-all duration-200 group block`}>
        {innerContent}
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      {innerContent}
    </div>
  );
}
