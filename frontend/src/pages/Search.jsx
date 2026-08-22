import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Users, Code2, Network, Briefcase, Building2, Globe2 } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadResults() {
      if (!query.trim()) {
        setResults(null);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // This endpoint in GraphController returns a map of categorized results
        const data = await fetchFromApi(`/search?q=${encodeURIComponent(query.trim())}`);
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="mt-12">
        <EmptyState title="Search the Graph" message="Enter a search term in the navigation bar to find people, skills, roles, and more." icon={SearchIcon} />
      </div>
    );
  }

  if (loading) return <LoadingSpinner message={`Searching for "${query}"...`} />;
  if (error) return <ErrorBanner message={error} />;
  
  // Calculate total results across all categories
  const totalResults = results ? Object.values(results).reduce((acc, curr) => acc + (curr ? curr.length : 0), 0) : 0;

  if (totalResults === 0) {
    return (
      <div className="mt-12">
        <EmptyState title="No results found" message={`We couldn't find anything matching "${query}".`} icon={SearchIcon} />
      </div>
    );
  }

  const renderSection = (title, items, icon, pathPrefix) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-8 last:mb-0">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 pb-2 border-b">
          {icon}
          <span className="ml-2">{title} ({items.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            // Skills and Techs don't have dedicated detail pages, so we link them to a search query for themselves
            const isSkillOrTech = pathPrefix === 'skills' || pathPrefix === 'technologies';
            const targetUrl = isSkillOrTech 
              ? `/search?q=${encodeURIComponent(item.name)}`
              : `/${pathPrefix}/${item.id}`;

            return (
              <Link
                key={item.id}
                to={targetUrl}
                className="block p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all"
              >
                <h3 className="font-semibold text-gray-900">{item.name || item.title}</h3>
                {item.email && <p className="text-sm text-gray-500 mt-1">{item.email}</p>}
                {item.category && <p className="text-sm text-gray-500 mt-1">{item.category}</p>}
                {item.level && <p className="text-sm text-gray-500 mt-1">Level: {item.level}</p>}
                {item.industry && <p className="text-sm text-gray-500 mt-1">Industry: {item.industry}</p>}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-500 mt-1">Found {totalResults} matching records in the graph.</p>
      </div>

      <div className="space-y-8">
        {renderSection("People", results.people, <Users className="w-6 h-6 text-blue-500" />, "people")}
        {renderSection("Skills", results.skills, <Code2 className="w-6 h-6 text-green-500" />, "skills")}
        {renderSection("Technologies", results.technologies, <Network className="w-6 h-6 text-purple-500" />, "technologies")}
        {renderSection("Roles", results.roles, <Briefcase className="w-6 h-6 text-orange-500" />, "roles")}
        {renderSection("Companies", results.companies, <Building2 className="w-6 h-6 text-red-500" />, "companies")}
        {renderSection("Domains", results.domains, <Globe2 className="w-6 h-6 text-teal-500" />, "domains")}
      </div>
    </div>
  );
}
