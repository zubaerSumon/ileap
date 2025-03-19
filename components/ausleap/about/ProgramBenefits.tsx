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
    <section className="text-center py-20">
      <h2 className="text-2xl font-bold text-black pb-6">See the program</h2>
      <p className="text-gray-500 text-sm mb-6">Take a view on our program</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {items.map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-8 text-center border border-gray-100">
            <div className="h-28 mb-6 rounded-md flex items-center justify-center relative">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            <h3 className="text-base font-medium text-[#4A4A4A]">{item.title}</h3>
            <p className="text-gray-400 text-xs mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
