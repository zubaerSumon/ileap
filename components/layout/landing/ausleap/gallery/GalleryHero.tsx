"use client";

export default function GalleryHero() {
  return (
    <section className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AusLEAP Gallery
          </h1>
          <p className="text-lg md:text-xl mb-8">
            <span className="text-blue-500">&quot;</span> AusLEAP is a
            volunteering organisation that not only introduces you to
            volunteering but introduces you to yourself 
            <span className="text-blue-500"> &quot;</span>
            <span className="block text-sm mt-2 text-white">
              -AusLEAP participant, 2023
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
