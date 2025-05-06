'use client';

import { Star } from 'lucide-react';

export default function GalleryHero() {
  return (
    <section className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AusLEAP Gallery</h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>Excellent</span>
            <span>4.7 out of 5</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Google review</span>
          </div>
        </div>
      </div>
    </section>
  );
}