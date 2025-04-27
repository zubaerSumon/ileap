"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface MiniGalleryProps {
  title?: string;
  seeMoreLink?: string;
}

const MiniGallery: React.FC<MiniGalleryProps> = ({
  title = "Check out our past program successes",
  seeMoreLink = "/ausleap/gallery",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // You'll need to replace these with your actual image paths
  const galleryImages = [
    "/mg1.svg",
    "/mg2.svg",
    "/mg3.svg",
    "/mg4.svg",
    "/mg5.svg",
    "/mg6.svg",
  ];
  
  // Custom widths for each image
  const imageWidths = [
    "140px",  // Image 1
    "130px",  // Image 2
    "85px",   // Image 3
    "66px",   // Image 4
    "130px",  // Image 5
    "150px",  // Image 6
  ];

  return (
    <>
      {/* Desktop version */}
      <div className="hidden sm:flex bg-[#254A9B] rounded-[51px] w-[480px] h-[450px] pb-7 pt-8 px-7 flex-col">
        <h2 className="text-white text-center font-inter text-sm font-normal leading-normal pb-1">
          {title}
        </h2>
        
        <div className="bg-[#F5F8FF] rounded-[51px] p-2 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 sm:gap-2 flex-1 justify-center items-start pt-2 sm:pt-6">
            {galleryImages.map((src, index) => (
                <div 
                  key={index} 
                  className="relative rounded-xl overflow-hidden"
                  style={{ 
                    height: isMobile ? "60px" : (index < 3 ? "120px" : "110px"),
                    width: isMobile ? `${parseInt(imageWidths[index]) * 0.45}px` : imageWidths[index],
                    marginRight: index === 2 || index === 5 ? '0' : '0.5rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              )
            )}
          </div>
          
          <div className="mt-3 flex justify-center w-[150px] mx-auto pb-4">
            <Link 
              href={seeMoreLink}
              className="  flex px-[18px] py-[6px] justify-center items-center gap-[6px] flex-[1_0_0] rounded-[6px] bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              See more
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden bg-[#254A9B] rounded-[51px] w-[320px] h-[350px] pb-2 pt-2 px-3 flex flex-col">
        <h2 className="text-white text-center font-inter text-sm font-normal leading-normal pb-3 pt-2 px-2">
          {title}
        </h2>
        
        <div className="bg-[#F5F8FF] rounded-[51px] p-2 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 flex-1 justify-center items-start pt-2">
            {galleryImages.map((src, index) => (
              <div 
                key={index} 
                className="relative rounded-xl overflow-hidden"
                style={{ 
                  height: "80px",
                  width: index === 0 ? "250px" : index === 1 ? "150px" : "70px",
                  marginRight: index === 2 ? '0' : '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            )).slice(0, 3)}
          </div>
          
          <div className="mt-3 flex justify-center w-[150px] mx-auto pb-4">
            <Link 
              href={seeMoreLink}
              className="flex px-[18px] py-[6px] justify-center items-center gap-[6px] flex-[1_0_0] rounded-[6px] bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              See more
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniGallery;