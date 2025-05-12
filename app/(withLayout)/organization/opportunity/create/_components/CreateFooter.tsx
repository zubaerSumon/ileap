"use client";

import { Button } from "@/components/ui/button";
 
interface CreateFooterProps {
  step: number;
  onNext?: () => void;
  onSaveDraft?: () => void;
  onCreate?: () => void;
}

export default function CreateFooter({ step, onNext, onSaveDraft, onCreate }: CreateFooterProps) {
 
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-[#F5F7FA]">
      <div className="container mx-auto py-4 flex justify-end items-center">
        <div className="flex gap-3">
          <Button variant="outline" className="text-gray-600" onClick={onSaveDraft}>
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onCreate}>
              Create Opportunity
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
