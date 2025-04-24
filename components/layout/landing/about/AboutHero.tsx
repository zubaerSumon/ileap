'use client';

import { Star } from "lucide-react";

export default function AboutHero() {
  return (
    <div className="bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">About Us</h1>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-lg text-gray-300">
          <div className="flex items-center justify-center gap-2 text-sm mb-8">
            <span>Excellent</span>
            <span>4.7 out of 5</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}