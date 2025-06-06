'use client';

import { useState } from 'react';
// import { Search, MapPin, Star } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';

const Hero = () => {
  const [] = useState('');
  const [] = useState('');


  return (
    <section className="relative bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Together, We Can Build a<br />
            Better Tomorrow.
          </h1>
          
         
          <div className="flex items-center justify-center gap-2 text-sm mb-8">
            <span>Excellent</span>
            <span>4.7 out of 5</span>
            {/* <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> */}
            <span>Google review</span>
          </div>
          
         {/* 
          <Card className="bg-white rounded-lg shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-start gap-8 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 6C9 5.44772 9.44772 5 10 5H14C14.5523 5 15 5.44772 15 6V11H9V6Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15 19H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>300+ volunteer works</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>All over Australia</span>
                </div>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full border-gray-200">
                      <SelectValue placeholder="Categories of volunteer work you're looking for" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-2 text-sm font-medium text-gray-500">Category</div>
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
                      <div className="px-2 py-2 text-sm font-medium text-gray-500">Location</div>
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
          */}
        </div>
      </div>
    </section>
  );
};

export default Hero;