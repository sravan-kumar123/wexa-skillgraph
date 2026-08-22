import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Code2, Network, Briefcase, Building2, Globe2 } from 'lucide-react';
import { fetchFromApi } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    people: 0,
    skills: 0,
    technologies: 0,
    roles: 0,
    companies: 0,
    domains: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);
        const [people, skills, techs, roles, companies, domains] = await Promise.all([
          fetchFromApi('/people'),
          fetchFromApi('/skills'),
          fetchFromApi('/technologies'),
          fetchFromApi('/roles'),
          fetchFromApi('/companies'),
          fetchFromApi('/domains'),
        ]);

        setStats({
          people: people.length || 0,
          skills: skills.length || 0,
          technologies: techs.length || 0,
          roles: roles.length || 0,
          companies: companies.length || 0,
          domains: domains.length || 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard statistics..." />;
  if (error) return <ErrorBanner message={error} />;

  const exploreLinks = [
    { name: 'People', href: '/people', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Skills', href: '/skills', icon: Code2, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Technologies', href: '/technologies', icon: Network, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Roles', href: '/roles', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Companies', href: '/companies', icon: Building2, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Domains', href: '/domains', icon: Globe2, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to SkillGraph</h2>
        <p className="mt-2 text-gray-600">
          Explore developers, skills, technologies, and career opportunities through the power of a connected graph.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total People" value={stats.people} icon={Users} color="blue" to="/people" />
        <StatCard title="Total Skills" value={stats.skills} icon={Code2} color="green" to="/skills" />
        <StatCard title="Total Techs" value={stats.technologies} icon={Network} color="purple" to="/technologies" />
        <StatCard title="Total Roles" value={stats.roles} icon={Briefcase} color="orange" to="/roles" />
        <StatCard title="Total Companies" value={stats.companies} icon={Building2} color="red" to="/companies" />
        <StatCard title="Total Domains" value={stats.domains} icon={Globe2} color="teal" to="/domains" />
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Explore the Skill Graph</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exploreLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
              >
                <div className={`p-4 rounded-lg ${link.bg} ${link.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{link.name}</h4>
                  <p className="text-sm text-gray-500">View all {link.name.toLowerCase()}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
