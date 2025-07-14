import Image from "next/image";

export default function ProgramBenefits() {
  const items = [
    {
      title: "Learn about Aussie culture",
      description: "Understand Australian language and workplace practices.",
      image: "/s1.svg",
    },
    {
      title: "Make friends",
      description: "Create long-lasting personal connections with like-minded people.",
      image: "/s2.svg",
    },
    {
      title: "Build professional networks",
      description: "Acquire valuable industry connections across universities and local communities.",
      image: "/s4.svg",
    },
    {
      title: "Create broader social impact",
      description: "Create meaningful change in the community.",
      image: "/s3.svg",
    },
    {
      title: "Improve employability",
      description: "Build essential soft skills that employers look for in every field.",
      image: "/s5.svg",
    },
    {
      title: "Receive official certification",
      description: "Validate your skills and experience in the AusLEAP program.",
      image: "/s6.svg",
    },
  ];

  return (
    <section className="text-center py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black pb-4 sm:pb-6">See the program</h2>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-6 sm:mb-8">Take a view on our program</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="h-20 sm:h-24 md:h-28 mb-4 sm:mb-6 rounded-md flex items-center justify-center relative">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority
                />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-[#4A4A4A] mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
