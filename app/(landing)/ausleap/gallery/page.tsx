"use client";

import GalleryGrid from "@/components/layout/landing/ausleap/gallery/GalleryGrid";
import GalleryHero from "@/components/layout/landing/ausleap/gallery/GalleryHero";
import { useEffect } from "react";

export default function GalleryPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GalleryHero />
      <div className="relative w-full h-[50vh] bg-black">
        <div className="absolute inset-0">
          <iframe
            src="https://player.vimeo.com/video/1017098219?h=d42ef94db3&autopause=0&autoplay=1&loop=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            className="w-full h-full"
            title="AUSLEAP 2024 HIGHLIGHT V3"
          ></iframe>
        </div>
      </div>
      <GalleryGrid />
    </div>
  );
}
