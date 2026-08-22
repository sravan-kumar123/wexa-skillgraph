import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, ArrowRight } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function loadRoles() {
      try {
        setLoading(true);
        const data = await fetchFromApi('/roles');
        setRoles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRoles();
  }, []);

  const filteredRoles = roles.filter(role => 
    role.title.toLowerCase().includes(filter.toLowerCase()) || 
    (role.level && role.level.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) return <LoadingSpinner message="Loading roles..." />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Roles ({roles.length})</h1>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Filter roles..."
          />
        </div>
      </div>

      {filteredRoles.length === 0 ? (
        <EmptyState title="No roles found" message="Try adjusting your filter" icon={Briefcase} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <Link
              key={role.id}
              to={`/roles/${role.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-orange-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Level: {role.level}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex items-center text-sm text-orange-600 font-medium mt-4">
                View Requirements
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
