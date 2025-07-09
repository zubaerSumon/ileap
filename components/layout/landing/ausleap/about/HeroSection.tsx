'use client';

import Image from 'next/image';
export default function HeroSection() {
  return (
    <div className="relative h-[350px] md:h-[350px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={"/images/ausleap-landing-hero.jpg"}
          alt="Group of volunteers with arms around each other"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/10"></div>
      </div>
      
      <div className="container h-full relative z-10 flex flex-col justify-center">
        <div className="max-w-3xl bg-[#000000A1] py-6 md:py-10 px-4 md:px-28">
          {/* UTS Logo */}
          <div className="mb-4 pl-2 md:pl-6">
            <Image 
              src="/UT.svg" 
              alt="UTS Logo" 
              width={80} 
              height={40}
              className=""
            />
          </div>
          
          <h1 className="text-lg md:text-2xl text-white mb-2 pl-2 md:pl-6">
            AusLEAP : volunteering opportunities
          </h1>
          <p className="text-lg md:text-2xl text-white pl-2 md:pl-6">
            for international students
          </p>
        </div>
      </div>
    </div>
  );
}