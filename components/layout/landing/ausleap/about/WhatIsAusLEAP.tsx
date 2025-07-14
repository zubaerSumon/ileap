"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WhatIsAusLEAP() {
  const router = useRouter();

  const handleJoinProgram = () => {
    router.push('/signup?role=volunteer');
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 text-center">
          What is AusLEAP?
        </h2>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-[1200px] mx-auto text-center leading-relaxed">
          AusLEAP is an innovative program that connects international students
          in NSW with local, established community, charity, not-for-profit and
          social enterprise organisations to undertake training and volunteering
          opportunities.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="bg-black text-white hover:bg-gray-800 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            onClick={handleJoinProgram}
          >
            Join the program
          </Button>
        </div>
      </div>
    </section>
  );
}
