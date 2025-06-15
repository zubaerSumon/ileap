"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateFooterProps {
  onSaveDraft: () => void;
  onCreate: () => void;
  isLoading: boolean;
}

export default function CreateFooter({ onSaveDraft, onCreate, isLoading }: CreateFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-[#F5F7FA]">
      <div className="container mx-auto py-4 flex justify-end items-center">
        <div className="flex gap-3">
          <Button variant="outline" className="text-gray-600" onClick={onSaveDraft}>
            Save as draft
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={onCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </div>
            ) : (
              "Create Opportunity"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
