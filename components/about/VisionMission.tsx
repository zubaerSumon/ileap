'use client';

import { Globe, Users } from 'lucide-react';

export default function VisionMission() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Globe className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To be a global platform of inspiration that brings meaningful positive change through social
              impact initiatives.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To empower both causes and their volunteers to build sustainable social change through
              seamless collaboration, fostering a world where every act of service creates lasting impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}