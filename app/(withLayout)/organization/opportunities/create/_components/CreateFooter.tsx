"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateFooterProps {
  onCreate: () => void;
  isLoading: boolean;
}

export default function CreateFooter({ onCreate, isLoading }: CreateFooterProps) {
  return (
    <div className="flex justify-end items-center mt-6">
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
  );
}
