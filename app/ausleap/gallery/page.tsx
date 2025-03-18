'use client';

import GalleryGrid from '@/components/ausleap/gallery/GalleryGrid';
import GalleryHero from '@/components/ausleap/gallery/GalleryHero';
 
export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <GalleryHero />
      <GalleryGrid />
    </div>
  );
}