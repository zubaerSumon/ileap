"use client";

import Image from "next/image";

export default function WhyILEAP2() {
  const features = [
    {
      image: "/image1.svg",
      title: "Connect with Ideal Volunteers for your Organisation",
      description:
        "Leverage our algorithmic matching system to find volunteers who are well-suited to your organisation’s needs.",
    },
    {
      image: "/image2.svg",
      title: "Streamlined Volunteer Management",
      description:
        "Efficiently handle scheduling and other management tasks with our user-friendly tools, designed to simplify your volunteer coordination efforts.",
    },
    {
      image: "/image3.svg",
      title: "Efficient Communication Channels",
      description:
        "Utilise our secure, encrypted messaging system for private conversations and take advantage of our broadcasting features for organisation-wide announcements for easy communication, ensuring clear and effective communication with all volunteers.",
    },
    {
      image: "/image4.svg",
      title: "Insightful Feedback Mechanisms",
      description:
        "Provide and receive valuable feedback to enhance volunteer experiences and improve organisational outcomes.",
    },
  ];

  return (
    <section className="py-16 pb-[100px] bg-white">
      <div className="container mx-auto px-4 max-w-[1340px]">
        <div className="text-center mb-12">
          <p className="text-gray-600 text-base">
            For COMMUNITY ORGANISATIONS Charity, not-for-profit, and social
            enterprise organisations
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.slice(0, 2).map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 border border-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <div className="mb-6">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.slice(2, 4).map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 border border-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <div className="mb-6">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
