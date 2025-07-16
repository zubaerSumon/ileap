"use client"
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => router.back()}
      variant="ghost"
      size="sm"
      className="flex mb-4 items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900 bg-gray-100 transition-colors duration-200 h-8 px-2"
    >
      <ArrowLeft className="h-3 w-3" />
      <span className="hidden sm:inline text-xs">Back</span>
    </Button>
  );
};

export default BackButton;
