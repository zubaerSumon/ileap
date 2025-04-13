'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { OpportunityContent } from "./components/OpportunityContent";
import { OpportunitySidebar } from "./components/OpportunitySidebar";

export default function OpportunityDetailPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <div className="bg-white rounded-lg max-w-[1100px] mx-auto py-10">
        <div className="max-w-[1012px] mx-auto px-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 mb-6">
            <ArrowLeft className="w-4 h-4 " />
            <button className="bg-gray-100">Back</button>
          </button>

          <div className="flex gap-8">
            <OpportunityContent />
            <div className="w-[1px] bg-gray-200"></div>
            <OpportunitySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}