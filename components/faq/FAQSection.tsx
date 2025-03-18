'use client';

import FAQAccordion from './FAQAccordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQItem[];
}

export default function FAQSection({ title, faqs }: FAQSectionProps) {
  return (
    <div className="mb-12 bg-white rounded-xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-4">{title}</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <FAQAccordion
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
}