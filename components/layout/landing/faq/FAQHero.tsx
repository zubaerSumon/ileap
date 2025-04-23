'use client';

import { Star } from 'lucide-react';

export default function FAQHero() {
  return (
    <div className="bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">Frequently Asked Questions</h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Star
                key={index}
                className="w-6 h-6 text-yellow-300 fill-current"
              />
            ))}
            <span className="text-white ml-2 text-lg font-medium">4.8/5.0</span>
          </div>
          <a
            href="https://www.google.com/search?q=AusLEAP+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-100 hover:text-white transition-colors duration-200 flex items-center space-x-2 underline"
          >
            <span>Read our reviews on Google</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}