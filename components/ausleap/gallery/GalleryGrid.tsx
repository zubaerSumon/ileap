'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

type GalleryImage = {
  id: number;
  year: string;
  src: string;
  alt: string;
  description: string;
};

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    year: '2024',
    src: '/grid1.svg',
    alt: 'Community Event',
    description: 'Community engagement workshop with local leaders'
  },
  {
    id: 2,
    year: '2024',
    src: '/grid1.svg',
    alt: 'Volunteer Training',
    description: 'Skills development session for new volunteers'
  },
  {
    id: 3,
    year: '2024',
    src: '/grid1.svg',
    alt: 'Team Building',
    description: 'Team building activities and leadership training'
  }
];

const galleryImages2: GalleryImage[] = [
  {
    id: 4,
    year: '2024',
    src: '/grid2.svg',
    alt: 'Event 1',
    description: 'Event description'
  },
  {
    id: 5,
    year: '2024',
    src: '/grid2.svg',
    alt: 'Event 2',
    description: 'Event description'
  },
  {
    id: 6,
    year: '2024',
    src: '/grid3.svg',
    alt: 'Event 3',
    description: 'Event description'
  },
  {
    id: 7,
    year: '2024',
    src: '/grid4.svg',
    alt: 'Event 4',
    description: 'Event description'
  },
  {
    id: 8,
    year: '2024',
    src: '/grid5.svg',
    alt: 'Event 5',
    description: 'Event description'
  }
];

export default function GalleryGrid() {
  // Define years in order (matching the UI)
  const years = ['2024', '2023', '2022', '2021'];
  const [activeYear, setActiveYear] = useState(years[0]);

  return (
    <section className="py-8 container mx-auto px-4">
      <Tabs defaultValue={activeYear} className="w-full" onValueChange={setActiveYear}>
        <TabsList className="bg-transparent inline-flex justify-center p-2 h-auto">
          {years.map((year) => (
            <TabsTrigger
              key={year}
              value={year}
              className="py-3 px-20 rounded data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 text-base font-medium border-0"
            >
              {year}
            </TabsTrigger>
          ))}
        </TabsList>

        {years.map((year) => (
          <TabsContent key={year} value={year} className="mt-8">
            {/* First Set */}
            <div className="grid grid-cols-3 gap-4">
              {galleryImages
                .filter(img => img.year === year)
                .map(image => (
                  <div key={image.id}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-5 gap-4 mt-4 mb-8">
              {galleryImages2
                .filter(img => img.year === year)
                .map(image => (
                  <div key={image.id}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>

            {/* Second Set */}
            <div className="grid grid-cols-3 gap-4">
              {galleryImages
                .filter(img => img.year === year)
                .map(image => (
                  <div key={`set2-${image.id}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-5 gap-4 mt-4 mb-8">
              {galleryImages2
                .filter(img => img.year === year)
                .map(image => (
                  <div key={`set2-${image.id}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>

            {/* Third Set */}
            <div className="grid grid-cols-3 gap-4">
              {galleryImages
                .filter(img => img.year === year)
                .map(image => (
                  <div key={`set3-${image.id}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-5 gap-4 mt-4 mb-8">
              {galleryImages2
                .filter(img => img.year === year)
                .map(image => (
                  <div key={`set3-${image.id}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>

            {/* Fourth Set */}
            <div className="grid grid-cols-3 gap-4">
              {galleryImages
                .filter(img => img.year === year)
                .map(image => (
                  <div key={`set4-${image.id}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-5 gap-4 mt-4">
              {galleryImages2
                .filter(img => img.year === year)
                .map(image => (
                  <div key={`set4-${image.id}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}