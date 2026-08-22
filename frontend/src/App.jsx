import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import People from './pages/People';
import PersonDetail from './pages/PersonDetail';
import Skills from './pages/Skills';
import Technologies from './pages/Technologies';
import Roles from './pages/Roles';
import RoleDetail from './pages/RoleDetail';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Domains from './pages/Domains';
import DomainDetail from './pages/DomainDetail';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/people" element={<People />} />
            <Route path="/people/:id" element={<PersonDetail />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/:id" element={<RoleDetail />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/domains/:id" element={<DomainDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Wexa AI - SkillGraph Assignment
        </div>
      </footer>
    </div>
  );
}

export default App;
