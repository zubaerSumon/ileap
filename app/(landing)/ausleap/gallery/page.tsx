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
        <div className="absolute inset-0  bg-opacity-50 z-10" />
        <div className="absolute inset-0">
          <iframe
            src="https://player.vimeo.com/video/1017098219?h=d42ef94db3&badge=0&autopause=0&player_id=0&app_id=58479&background=1&autoplay=1&loop=1&muted=1"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            className="w-full h-full"
            title="AUSLEAP 2024 HIGHLIGHT V3"
          ></iframe>
        </div>
      </div>
      <GalleryGrid />
    </div>
  );
}
