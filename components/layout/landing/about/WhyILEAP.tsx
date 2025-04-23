'use client';

import Image from 'next/image';

export default function WhyILEAP() {
  const features = [
    {
      image: '/tailored-volunteering.svg',
      title: 'Tailored Volunteering Experiences',
      description: 'Discover opportunities that align perfectly with your unique skills, interests and schedule Our innovative algorithm ensures you are matched with roles that truly resonate with you.'
    },
    {
      image: '/real-time-alerts.svg',
      title: 'Real-Time Opportunity Alerts',
      description: 'Stay informed with instant notifications about the latest volunteer roles that fit your interests, ensuring you never miss a chance to make a difference.'
    },
    {
      image: '/seamless-communication.svg',
      title: 'Seamless Communication with Organisations',
      description: 'Engage effortlessly with organisations through our messaging platform, keeping you connected and informed with latest updates and organisations'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-[1340px]">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3 pb-3">Why AusLEAP?</h2>
          <p className="text-gray-600 text-base">
            For VOLUNTEERS - Join a project or organization and start your volunteering journey!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-8 border border-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
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
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="max-w-xl mx-auto">
            {features.slice(2, 3).map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-8 border border-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
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
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}