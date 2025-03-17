'use client';

import Image from "next/image";

const Benefits = () => {
  const benefits = [
    {
      title: 'Perfect for solo volunteers',
      description: 'Start your journey today with our supportive community and expert guidance.',
      icon: '/globe.svg'
    },
    {
      title: 'Earn academic credits while you volunteer',
      description: 'Combine your passion for helping others with your academic goals through our accredited programs.',
      icon: '/file.svg'
    },
    {
      title: 'The ethical and responsible choice',
      description: 'Our programs are carefully vetted to ensure positive impact for both volunteers and communities.',
      icon: '/window.svg'
    },
    {
      title: 'Safe and impactful programs',
      description: 'Experience meaningful volunteering with our thoroughly assessed and secure programs.',
      icon: '/window.svg'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Over 5,000 people have volunteered with iLEAP. Here&apos;s why.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <Image
                src={benefit.icon}
                alt={benefit.title}
                width={40}
                height={40}
                className="w-12 h-12 mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
            Find your next opportunity
          </button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;