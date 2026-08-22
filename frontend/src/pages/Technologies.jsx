import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Network, Search } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function Technologies() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function loadTechs() {
      try {
        setLoading(true);
        const data = await fetchFromApi('/technologies');
        setTechnologies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTechs();
  }, []);

  const filteredTechs = technologies.filter(tech => 
    tech.name.toLowerCase().includes(filter.toLowerCase()) || 
    (tech.category && tech.category.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) return <LoadingSpinner message="Loading technologies..." />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Technologies ({technologies.length})</h1>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="Filter technologies..."
          />
        </div>
      </div>

      {filteredTechs.length === 0 ? (
        <EmptyState title="No technologies found" message="Try adjusting your filter" icon={Network} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechs.map((tech) => (
            <div key={tech.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-purple-300 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tech.category}
                  </span>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Network className="w-5 h-5" />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/search?q=${encodeURIComponent(tech.name)}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Find people with this tech &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
