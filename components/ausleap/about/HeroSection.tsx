'use client';

import Image from 'next/image';
export default function HeroSection() {
  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={"/volunteers-group.jpg"}
          alt="Group of volunteers with arms around each other"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center">
        <div className="max-w-3xl bg-[#000000A1]">
          {/* UTS Logo */}
          <div className="mb-4">
            <Image 
              src="/uts_logo.png" 
              alt="UTS Logo" 
              width={80} 
              height={40}
              className=""
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            AusLEAP : volunteering opportunities
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white">
            for international students
          </p>
        </div>
      </div>
    </div>
  );
}