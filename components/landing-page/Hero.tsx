'use client';

import { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const Hero = () => {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search:', { category, location });
  };

  return (
    <section className="relative bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Together, We Can Build a<br />
            Better Tomorrow.
          </h1>
          
          {/* Rating display */}
          <div className="flex items-center justify-center gap-2 text-sm mb-8">
            <span>Excellent</span>
            <span>4.7 out of 5</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Google review</span>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>300+ volunteer works</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span>All over Australia</span>
            </div>
          </div>
          
          {/* Search form */}
          <Card className="bg-white rounded-lg shadow-lg">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue placeholder="Categories of volunteer work you're looking for" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homeless">Homeless</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="australia-square">Australia Square</SelectItem>
                      <SelectItem value="sydney">Sydney</SelectItem>
                      <SelectItem value="melbourne">Melbourne</SelectItem>
                      <SelectItem value="brisbane">Brisbane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;