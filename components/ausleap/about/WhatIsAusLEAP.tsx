'use client';

import { Button } from '@/components/ui/button';

export default function WhatIsAusLEAP() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">What is AusLEAP?</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-8">
            AusLEAP is an innovative program designed for international students in Australia, providing unique volunteering opportunities while developing leadership and employability skills. Through structured workshops and hands-on experiences, participants gain valuable insights into Australian culture while making meaningful contributions to their communities.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">I&apos;m ready to join</Button>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Get the program guide</Button>
          </div>
        </div>
      </div>
    </section>
  );
}