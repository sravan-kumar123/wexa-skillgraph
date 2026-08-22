import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, Code2, Network, ArrowLeft } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

export default function RoleDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchFromApi(`/roles/${id}/requirements`);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading role requirements..." />;
  if (error) return <ErrorBanner message={error} />;
  if (!data || !data.role) return <ErrorBanner message="Role not found" />;

  const { role, skills = [], technologies = [] } = data;

  return (
    <div className="space-y-6">
      <Link to="/roles" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
        <ArrowLeft className="mr-1 w-4 h-4" /> Back to Roles
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-orange-600 p-6 md:p-8 text-white flex items-center space-x-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-md">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{role.title}</h1>
            <p className="text-orange-100 mt-1 text-lg">Level: {role.level}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 border-b pb-2">
              <Code2 className="w-6 h-6 mr-2 text-green-500" />
              Required Skills
            </h2>
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => (
                  <Link key={skill.id} to={`/search?q=${encodeURIComponent(skill.name)}`} className="block p-4 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                    <h3 className="font-semibold text-green-900">{skill.name}</h3>
                    <p className="text-sm text-green-700 mt-1">{skill.category}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific skills required for this role in the graph.</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 border-b pb-2">
              <Network className="w-6 h-6 mr-2 text-purple-500" />
              Required Technologies
            </h2>
            {technologies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {technologies.map(tech => (
                  <Link key={tech.id} to={`/search?q=${encodeURIComponent(tech.name)}`} className="block p-4 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                    <h3 className="font-semibold text-purple-900">{tech.name}</h3>
                    <p className="text-sm text-purple-700 mt-1">{tech.category}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific technologies required for this role in the graph.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
