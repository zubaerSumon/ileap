"use client";

import Image from "next/image";
export default function HeroSection() {
  return (
    <div className="relative h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={"/images/ausleap-landing-hero.jpg"}
          alt="Group of volunteers with arms around each other"
          height={532}
          width={1660}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      <div className="container h-full relative z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl bg-[#00000060] rounded-lg sm:rounded-tr-lg sm:rounded-br-lg py-3 sm:py-4 md:py-6 lg:py-10 px-4 sm:px-6 md:px-8 lg:px-28">
          <div className="mb-2 sm:mb-3 md:mb-4 pl-0 sm:pl-2 md:pl-6">
            <Image
              src="/UT.svg"
              alt="UTS Logo"
              width={40}
              height={20}
              className="w-[40px] h-[20px] sm:w-[60px] sm:h-[30px] md:w-[80px] md:h-[40px]"
            />
          </div>

          <h1 className="text-sm sm:text-base md:text-lg lg:text-2xl text-white mb-1 sm:mb-2 pl-0 sm:pl-2 md:pl-6 font-medium sm:font-semibold">
            AusLEAP : volunteering opportunities
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-white pl-0 sm:pl-2 md:pl-6">
            for international students
          </p>
        </div>
      </div>
    </div>
  );
}
