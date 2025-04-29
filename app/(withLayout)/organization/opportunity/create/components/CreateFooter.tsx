"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateFooter({ step }: { step: number }) {
  const router = useRouter();

  const handleNext = () => {
    if (step === 1) {
      router.push("/organization/opportunity/create/schedule");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-[#F5F7FA]">
      <div className="container mx-auto py-4 flex justify-end items-center">
        <div className="flex gap-3">
          <Button variant="outline" className="text-gray-600">
            Save as draft
          </Button>
          {step === 1 ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Opportunity
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
