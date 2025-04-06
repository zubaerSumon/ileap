'use client';

import GalleryGrid from '@/components/layout/unprotected/ausleap/gallery/GalleryGrid';
import GalleryHero from '@/components/layout/unprotected/ausleap/gallery/GalleryHero';
 import Image from 'next/image';
export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <GalleryHero />
      <div className="w-full relative">
        <Image
          src="/gallerybanner.svg"
          width={1920}
          height={500}
          alt="Gallery Banner"
          className="w-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-63"></div>
      </div>
      <GalleryGrid />
    </div>
  );
}