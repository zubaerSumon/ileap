'use client';

 
import { Globe, FileText, Shield, Heart, Star, Award } from 'lucide-react';

export default function WhyILEAP() {
  const benefits = [
    {
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      title: 'Global Impact',
      description: 'Connect with opportunities worldwide and make a difference across borders.'
    },
    {
      icon: <FileText className="w-12 h-12 text-blue-600" />,
      title: 'Verified Programs',
      description: 'All volunteer programs are thoroughly vetted to ensure quality and impact.'
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: 'Safe & Secure',
      description: 'Your safety and security are our top priorities in every program.'
    },
    {
      icon: <Heart className="w-12 h-12 text-blue-600" />,
      title: 'Meaningful Connections',
      description: 'Build lasting relationships with like-minded individuals and communities.'
    },
    {
      icon: <Star className="w-12 h-12 text-blue-600" />,
      title: 'Skill Development',
      description: 'Gain valuable experience and develop new skills through volunteering.'
    },
    {
      icon: <Award className="w-12 h-12 text-blue-600" />,
      title: 'Recognition',
      description: 'Earn certificates and recognition for your volunteer contributions.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why iLEAP?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}