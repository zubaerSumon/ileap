"use client";

import { ArrowLeft } from "lucide-react";
import { PostContent } from "@/components/layout/volunteer/homepage/PostContent";
import { Sidebar } from "@/components/layout/volunteer/homepage/Sidebar";
import { useRouter, useParams } from "next/navigation";
import Footer from "@/components/Footer";
import TopNavigationBar from "@/components/TopNavigationBar";

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // Add error handling for invalid IDs
  if (!opportunityId || !["1", "2"].includes(opportunityId)) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
        
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Opportunity not found</h1>
          <p className="text-gray-600 mt-2">The opportunity you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
   
    <div className="flex flex-col min-h-screen"><TopNavigationBar/>
      <div className="flex-1 max-w-[1280px] mx-auto px-4 mb-8 pt-20">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-8">
          <PostContent opportunityId={opportunityId} />
          <div className="w-[1px] bg-gray-200"></div>
          <Sidebar opportunityId={opportunityId} />
        </div>
      </div>
      <Footer  />
    </div>
  );
}