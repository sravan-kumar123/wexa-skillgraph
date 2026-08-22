import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function GlobalSearch() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync state when URL parameter changes or navigating away from search
  useEffect(() => {
    if (location.pathname === '/search') {
      setQuery(searchParams.get('q') || '');
    } else {
      setQuery('');
    }
  }, [searchParams, location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      // Only clear if we are not navigating to search, but here we are navigating TO search.
      // So don't clear the input, let it remain.
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search for people, skills, roles..."
      />
    </form>
  );
}
