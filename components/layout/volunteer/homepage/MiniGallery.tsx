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
  const galleryImages = [
    "/mg1.svg",
    "/mg2.svg",
    "/mg3.svg",
    "/mg4.svg",
    "/mg5.svg",
    "/mg6.svg",
  ];

  const imageWidths = ["110px", "110px", "77px", "60px", "105px", "125px"];

  const imageHeight = "100px";

  return (
    <>
      {/* Desktop version */}
      <div className="hidden sm:flex bg-[#254A9B] rounded-[51px] w-[380px] h-[400px] p-6 flex-col">
        <h2 className="text-white text-center font-inter text-sm font-normal leading-normal mb-4">
          {title}
        </h2>

        <div className="bg-[#F5F8FF] rounded-[40px]  p-5 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-wrap gap-3 justify-center items-start">
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden"
                style={{
                  height: imageHeight,
                  width: `${parseInt(imageWidths[index]) * 0.9}px`,
                 }}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-auto mb-1">
            <Link
              href={seeMoreLink}
              className="flex px-[18px] py-[6px] justify-center items-center gap-[6px] rounded-[6px] bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-600 transition-colors w-[120px]"
            >
              See more
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden bg-[#254A9B] rounded-[51px] w-[340px] h-[400px] pb-3 pt-3 px-4 flex flex-col">
        <h2 className="text-white text-center font-inter text-sm font-normal leading-normal pb-4 pt-2 px-2">
          {title}
        </h2>

        <div className="bg-[#F5F8FF] rounded-[51px] p-3 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-3 flex-1 justify-center items-start pt-3">
            {galleryImages
              .map((src, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    height: imageHeight,
                    width:
                      index === 0 ? "250px" : index === 1 ? "150px" : "70px",
                    marginRight: index === 2 ? "0" : "0.5rem",
                    marginBottom: "0.5rem",
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
              ))
              .slice(0, 3)}
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
