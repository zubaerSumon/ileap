'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

interface FAQAccordionProps {
  question: string;
  answer: string;
}

export default function FAQAccordion({ question, answer }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 hover:border-gray-300 transition-colors duration-200">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}