import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Search, ArrowRight } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function loadDomains() {
      try {
        setLoading(true);
        const data = await fetchFromApi('/domains');
        setDomains(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDomains();
  }, []);

  const filteredDomains = domains.filter(d => 
    d.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading domains..." />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Domains ({domains.length})</h1>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Filter domains..."
          />
        </div>
      </div>

      {filteredDomains.length === 0 ? (
        <EmptyState title="No domains found" message="Try adjusting your filter" icon={Globe2} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((domain) => (
            <Link
              key={domain.id}
              to={`/domains/${domain.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-teal-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {domain.name}
                </h3>
                <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                  <Globe2 className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex items-center text-sm text-teal-600 font-medium mt-4">
                View Domain Details
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
