"use client";

import { ArrowLeft } from "lucide-react";
import { PostContent } from "@/components/layout/volunteer/homepage/PostContent";
import { Sidebar } from "@/components/layout/volunteer/homepage/Sidebar";
import { useRouter, useParams } from "next/navigation";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!opportunityId || !["1", "2", "3", "4"].includes(opportunityId)) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer text-gray-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Opportunity not found</h1>
          <p className="text-gray-600 mt-2">
            The opportunity you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedLayout>
      <div className="flex flex-col min-h-screen">
       <div className="flex-1 max-w-[1280px] mx-auto px-4 mb-8 pt-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="flex-1">
            <PostContent opportunityId={opportunityId} />
          </div>
          <div className="hidden lg:block w-[1px] bg-gray-200"></div>
          <div className="lg:w-[300px] shrink-0">
            <Sidebar opportunityId={opportunityId} />
          </div>
          
        </div>
      </div> 
    </div>
    </ProtectedLayout>
  );
}
