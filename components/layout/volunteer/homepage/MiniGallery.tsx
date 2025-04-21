"use client";

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
    <div className="bg-[#254A9B] rounded-[51px] w-[450px] h-[450px] pb-8 pt-6 px-6 flex flex-col">
      <h2 className="text-white text-center font-inter text-base font-normal leading-normal mb-2 pb-2">
        {title}
      </h2>
      
      <div className="bg-[#F5F8FF] rounded-[51px] p-2 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 flex-1 justify-center items-start pt-6">
          {galleryImages.map((src, index) => (
            <div 
              key={index} 
              className="relative rounded-xl overflow-hidden"
              style={{ 
                height: index < 3 ? "120px" : "110px",
                width: imageWidths[index]
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
          ))}
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
  );
};

export default MiniGallery;