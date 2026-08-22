import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, ArrowRight } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function People() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPeople() {
      try {
        setLoading(true);
        const data = await fetchFromApi('/people');
        setPeople(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPeople();
  }, []);

  if (loading) return <LoadingSpinner message="Loading people..." />;
  if (error) return <ErrorBanner message={error} />;
  if (!people || people.length === 0) return <EmptyState title="No people found" icon={Users} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">People ({people.length})</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person) => (
          <Link
            key={person.id}
            to={`/people/${person.id}`}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {person.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {person.name}
                </h2>
                {person.email && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Mail className="w-4 h-4 mr-1" />
                    {person.email}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-blue-600 font-medium mt-4">
              View Profile & Recommendations
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
