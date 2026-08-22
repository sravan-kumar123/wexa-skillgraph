import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Briefcase, ArrowLeft } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

export default function CompanyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // This endpoint in GraphController returns a map containing company and roles
        const response = await fetchFromApi(`/companies/${id}/roles`);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading company details..." />;
  if (error) return <ErrorBanner message={error} />;
  if (!data || !data.company) return <ErrorBanner message="Company not found" />;

  const { company, roles = [] } = data;

  return (
    <div className="space-y-6">
      <Link to="/companies" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
        <ArrowLeft className="mr-1 w-4 h-4" /> Back to Companies
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-red-600 p-6 md:p-8 text-white flex items-center space-x-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-red-100 mt-1 text-lg">Industry: {company.industry}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6 border-b pb-2">
            <Briefcase className="w-6 h-6 mr-2 text-orange-500" />
            Roles Available ({roles.length})
          </h2>
          
          {roles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => (
                <Link 
                  key={role.id} 
                  to={`/roles/${role.id}`} 
                  className="block p-5 border border-orange-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-orange-400 transition-all"
                >
                  <h3 className="font-semibold text-lg text-gray-900">{role.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Level: {role.level}</p>
                  
                  <div className="mt-4 text-sm font-medium text-orange-600">
                    View Requirements &rarr;
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No specific roles offered by this company in the graph.</p>
          )}
        </div>
      </div>
    </div>
  );
}
