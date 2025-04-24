"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WhatIsAusLEAP() {
  const router = useRouter();

  const handleJoinProgram = () => {
    router.push('/signup?role=volunteer');
  };

  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          What is AusLEAP?
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-[1200px] mx-auto text-center">
          AusLEAP is an innovative program that connects international students
          in NSW with local, established community, charity, not-for-profit and
          social enterprise organisations to undertake training and volunteering
          opportunities.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="bg-black text-white"
            onClick={handleJoinProgram}
          >
            Join the program
          </Button>
        </div>
      </div>
    </section>
  );
}
