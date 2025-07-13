"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
 
interface CreateFooterProps {
  onCreate: () => void;
  isLoading: boolean;
}

export default function CreateFooter({
  onCreate,
  isLoading,
}: CreateFooterProps) {
  return (
    <div className="flex justify-center sm:justify-end items-center mt-6 px-4 sm:px-0">
      <Button
        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto px-6 py-2 sm:py-2"
        onClick={onCreate}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loading size="medium">
            <p className="text-gray-600 mt-2">Creating...</p>
          </Loading>
        ) : (
          "Create Opportunity"
        )}
      </Button>
         
    </div>
  );
}
