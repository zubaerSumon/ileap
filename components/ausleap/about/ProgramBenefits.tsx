'use client';

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export default function ProgramBenefits() {
  const programBenefits: Benefit[] = [
    {
      title: 'Learn about Student culture',
      description: 'Learn about the diverse student culture and engage with peers from different backgrounds.',
      icon: '👥'
    },
    {
      title: 'Ready to help',
      description: 'Get prepared with the skills and knowledge needed to make a meaningful impact.',
      icon: '🤝'
    },
    {
      title: 'Build professional networks',
      description: 'Connect with like-minded individuals and organizations to expand your network.',
      icon: '🌐'
    },
    {
      title: 'Grow in your social impact',
      description: 'Develop your leadership skills and make a lasting difference in your community.',
      icon: '📈'
    },
    {
      title: 'Improve employability',
      description: 'Gain valuable experience and skills that enhance your career prospects.',
      icon: '💼'
    },
    {
      title: 'Receive official certificates',
      description: 'Get recognized for your participation and achievements in the program.',
      icon: '🎓'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">See the program</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programBenefits.map((benefit, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}