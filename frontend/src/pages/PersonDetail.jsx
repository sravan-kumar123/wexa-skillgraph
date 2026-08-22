import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Code2, Network, Briefcase, Building2, ArrowLeft } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

export default function PersonDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch person details and recommendations in parallel
        const [personData, recsData] = await Promise.all([
          fetchFromApi(`/people/${id}`),
          fetchFromApi(`/graph/recommendations/${id}`).catch(() => null) // Ignore 404s for recs if any
        ]);
        
        setData(personData);
        if (recsData && recsData.roles) {
          setRecommendations(recsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (error) return <ErrorBanner message={error} />;
  if (!data || !data.person) return <ErrorBanner message="Person not found" />;

  const { person, skills = [], technologies = [] } = data;

  return (
    <div className="space-y-6">
      <Link to="/people" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
        <ArrowLeft className="mr-1 w-4 h-4" /> Back to People
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 p-6 md:p-8 text-white flex items-center space-x-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-md">
            {person.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{person.name}</h1>
            <p className="text-blue-100 mt-1">{person.email}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Code2 className="w-5 h-5 mr-2 text-green-500" />
              Skills ({skills.length})
            </h2>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills recorded.</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Network className="w-5 h-5 mr-2 text-purple-500" />
              Technologies ({technologies.length})
            </h2>
            {technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technologies.map(tech => (
                  <span key={tech.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    {tech.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No technologies recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Graph Recommendations Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Recommendations</h2>
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm border border-blue-100 flex items-start">
          <Network className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">How this works</p>
            <p>
              These are graph-based recommendations. The application traverses relationships between People, Skills, Roles, and Companies to identify relevant career opportunities.
              <br/>
              <span className="text-blue-600 mt-1 block italic">Graph path:<br/>Person → HAS_SKILL → Skill → REQUIRES_SKILL → Role → OFFERS_ROLE → Company</span>
            </p>
          </div>
        </div>

        {!recommendations || (recommendations.roles.length === 0 && recommendations.companies.length === 0) ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            No graph recommendations available at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recommended Roles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                Matching Roles
              </h3>
              <ul className="divide-y divide-gray-100">
                {recommendations.roles.map(role => (
                  <li key={role.id} className="py-4 first:pt-0 last:pb-0">
                    <Link to={`/roles/${role.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-md transition-colors">
                      <p className="text-md font-medium text-blue-600">{role.title}</p>
                      <p className="text-sm text-gray-500">Level: {role.level}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Companies */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <Building2 className="w-5 h-5 mr-2 text-red-500" />
                Relevant Companies
              </h3>
              <ul className="divide-y divide-gray-100">
                {recommendations.companies.map(company => (
                  <li key={company.id} className="py-4 first:pt-0 last:pb-0">
                    <Link to={`/companies/${company.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-md transition-colors">
                      <p className="text-md font-medium text-blue-600">{company.name}</p>
                      <p className="text-sm text-gray-500">Industry: {company.industry}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
