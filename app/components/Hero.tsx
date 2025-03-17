'use client';

import { useState } from 'react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search:', { searchQuery, selectedLocation });
  };

  return (
    <section className="relative bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Together, We Can Build a<br />
            Better Tomorrow.
          </h1>
          <form onSubmit={handleSearch} className="mt-8">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="text"
                placeholder="Search by cause"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-6 py-3 rounded-lg bg-white text-black w-full md:w-64"
              />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-6 py-3 rounded-lg bg-white text-black w-full md:w-48"
              >
                <option value="">All Locations</option>
                <option value="local">Local</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;