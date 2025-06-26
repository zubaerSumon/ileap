"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import MobileTabsSlider from "@/components/layout/shared/MobileTabsSlider";

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
    year: "2024",
    src: "/2024-1.jpg",
    alt: "Community Event 1",
    description: "Community engagement workshop with local leaders",
  },
  {
    id: 2,
    year: "2024",
    src: "/2024-2.jpg",
    alt: "Community Event 2",
    description: "Skills development session for new volunteers",
  },
  {
    id: 3,
    year: "2024",
    src: "/2024-3.jpg",
    alt: "Community Event 3",
    description: "Team building activities and leadership training",
  },
  {
    id: 4,
    year: "2024",
    src: "/2024-4.jpg",
    alt: "Community Event 4",
    description: "Community workshop session",
  },
  {
    id: 5,
    year: "2024",
    src: "/2024-5.jpg",
    alt: "Community Event 5",
    description: "Leadership development program",
  },
  {
    id: 6,
    year: "2024",
    src: "/2024-6.jpg",
    alt: "Community Event 6",
    description: "Volunteer coordination meeting",
  },
  {
    id: 7,
    year: "2024",
    src: "/2024-7.jpg",
    alt: "Community Event 7",
    description: "Community outreach program",
  },
  {
    id: 8,
    year: "2024",
    src: "/2024-8.jpg",
    alt: "Community Event 8",
    description: "Skills training workshop",
  },
  {
    id: 9,
    year: "2024",
    src: "/2024-9.jpg",
    alt: "Community Event 9",
    description: "Team collaboration session",
  },
  {
    id: 10,
    year: "2024",
    src: "/2024-10.jpg",
    alt: "Community Event 10",
    description: "Community gathering event",
  },
  // Repeat similar structure for 2023 and 2022
  {
    id: 11,
    year: "2023",
    src: "/2023-1.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 12,
    year: "2023",
    src: "/2023-2.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 13,
    year: "2023",
    src: "/2023-3.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },

  {
    id: 14,
    year: "2023",
    src: "/2023-4.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 15,
    year: "2023",
    src: "/2023-5.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 16,
    year: "2023",
    src: "/2023-6.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 17,
    year: "2023",
    src: "/2023-7.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 18,
    year: "2023",
    src: "/2023-8.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 19,
    year: "2023",
    src: "/2023-9.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },
  {
    id: 20,
    year: "2023",
    src: "/2023-10.jpg",
    alt: "2023 Event ",
    description: "Community event from 2023",
  },

  {
    id: 21,
    year: "2022",
    src: "/2022-1.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 22,
    year: "2022",
    src: "/2022-2.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 23,
    year: "2022",
    src: "/2022-3.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 24,
    year: "2022",
    src: "/2022-4.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 25,
    year: "2022",
    src: "/2022-5.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 26,
    year: "2022",
    src: "/2022-6.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 27,
    year: "2022",
    src: "/2022-7.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 28,
    year: "2022",
    src: "/2022-8.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 29,
    year: "2022",
    src: "/2022-9.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  {
    id: 30,
    year: "2022",
    src: "/2022-10.jpg",
    alt: "2022 Event ",
    description: "Community event from 2022",
  },
  // ... Add 9 more events for 2022
];

export default function GalleryGrid() {
  const years = ["2024", "2023", "2022"];
  const [activeYear, setActiveYear] = useState(years[0]);

  const mobileTabs = years.map(year => ({
    label: year,
    value: year
  }));

  // Function to get random size class
  const getRandomSize = () => {
    const sizes = [
      'col-span-1 row-span-1',  // normal square
      'col-span-2 row-span-1',  // wide
      'col-span-1 row-span-2',  // tall
      'col-span-2 row-span-2',  // large
    ];
    // Ensure more predictable pattern by using index-based sizing
    return sizes[0]; // Always return normal square size for now
  };

  return (
    <section className="py-4 sm:py-8 container mx-auto px-2 sm:px-4">
      {/* Mobile Tabs Slider */}
      <MobileTabsSlider
        tabs={mobileTabs}
        activeTab={activeYear}
        onTabChange={setActiveYear}
        className="mb-6"
      />

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs
          value={activeYear}
          className="w-full"
          onValueChange={setActiveYear}
        >
          <TabsList className="bg-transparent flex flex-wrap justify-center p-1 sm:p-2 h-auto gap-2">
            {years.map((year) => (
              <TabsTrigger
                key={year}
                value={year}
                className="py-1.5 px-3 sm:py-2 sm:px-4 md:px-8 lg:px-20 rounded data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 text-xs sm:text-sm md:text-base font-medium border-0 transition-all"
              >
                {year}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-8">
        {years.map((year) => (
          <div key={year} className={activeYear === year ? "block" : "hidden"}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 auto-rows-[200px]">
              {galleryImages
                .filter((img) => img.year === year)
                .map((image) => (
                  <div
                    key={image.id}
                    className={`relative group ${getRandomSize()}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 rounded-lg" />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
