'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Workshop {
  id: number;
  title: string;
  date: string;
  duration: string;
  description: string[];
}

export default function WorkshopOverview() {
  const [expandedWorkshop, setExpandedWorkshop] = useState<number | null>(null);

  const workshops: Workshop[] = [
    {
      id: 1,
      title: 'Workshop 1',
      date: 'SAT 14 APR, 10:30-12:30',
      duration: '2 hrs',
      description: [
        'Introduction to AusLEAP program',
        'Learn about Student culture',
        'Get tips on how to make friends',
        'Develop awareness and understanding about safety while engaging in volunteering opportunities'
      ]
    },
    {
      id: 2,
      title: 'Workshop 2',
      date: 'SAT 21 APR, 10:30-12:30',
      duration: '2 hrs',
      description: [
        'Learn how to serve as a project leader',
        'Design and create effective presentations',
        'Engage with a panel of inspiring leaders'
      ]
    },
    {
      id: 3,
      title: 'Workshop 3',
      date: 'SAT 28 APR, 10:30-12:30',
      duration: '2 hrs',
      description: [
        'Celebrate your participation of the AusLEAP program',
        'Reflect and share your experience of working towards meaningful social difference'
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Workshop overview</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full p-4 text-left flex items-center justify-between"
                onClick={() => setExpandedWorkshop(expandedWorkshop === workshop.id ? null : workshop.id)}
              >
                <div>
                  <h3 className="text-lg font-semibold">{workshop.title}</h3>
                  <div className="text-sm text-gray-500">
                    <span>{workshop.date}</span>
                    <span className="mx-2">•</span>
                    <span>{workshop.duration}</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${expandedWorkshop === workshop.id ? 'transform rotate-180' : ''}`}
                />
              </button>
              {expandedWorkshop === workshop.id && (
                <div className="p-4 border-t border-gray-200">
                  <ul className="space-y-2">
                    {workshop.description.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}