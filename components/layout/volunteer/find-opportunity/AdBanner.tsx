"use client";

import Image from "next/image";

export default function AdBanner() {
  return (
    <div className="w-full lg:w-4/12">
      <div className="lg:sticky lg:top-24 bg-blue-500 py-6 md:py-12 px-4 md:px-6 rounded-md">
        <Image
          src="/images/banners/ad-banner-browse-opportunities.png"
          alt="Make a greater impact on the inside"
          width={400}
          height={600}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
} 