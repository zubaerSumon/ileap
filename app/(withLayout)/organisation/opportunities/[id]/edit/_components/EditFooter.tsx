"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditFooterProps {
  onUpdate: () => void;
  isLoading: boolean;
}

export default function EditFooter({ onUpdate, isLoading }: EditFooterProps) {
  return (
    <div className="flex justify-center sm:justify-end items-center mt-6 px-4 sm:px-0">
      <Button
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 w-full sm:w-auto px-6 py-2 sm:py-2"
        onClick={onUpdate}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Updating Opportunity...
          </>
        ) : (
          "Update Opportunity"
        )}
      </Button>
    </div>
  );
}
