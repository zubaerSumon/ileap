'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

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
    src: '/volunteers-group.jpg',
    alt: 'Volunteer Group Photo',
    description: 'AusLEAP volunteers at community event'
  },
  {
    id: 2,
    year: '2023',
    src: '/raised-hands.jpg',
    alt: 'Team Building Activity',
    description: 'Leadership workshop session'
  },
  // Add more images here
];

export default function GalleryGrid() {
  // Define years in order (matching the UI)
  const years = ['2024', '2023', '2022', '2021'];
  const [activeYear, setActiveYear] = useState(years[0]);

  return (
    <section className="py-8 container mx-auto px-4">
      <Tabs defaultValue={activeYear} className="w-full" onValueChange={setActiveYear}>
        <TabsList className="bg-transparent w-full flex space-x-0 p-0 h-auto">
          {years.map((year) => (
            <TabsTrigger
              key={year}
              value={year}
              className="flex-1 py-3 px-4 rounded-none data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 text-base font-medium border-0"
            >
              {year}
            </TabsTrigger>
          ))}
        </TabsList>

        {years.map((year) => (
          <TabsContent key={year} value={year} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages
                .filter(img => img.year === year)
                .map(image => (
                  <Card key={image.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600">{image.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}