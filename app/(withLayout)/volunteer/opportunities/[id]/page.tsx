"use client";

import { Loader2 } from "lucide-react";
import { PostContent } from "@/components/layout/volunteer/home-page/PostContent";
import { Sidebar } from "@/components/layout/volunteer/home-page/Sidebar";
import { useParams } from "next/navigation";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";

export default function OpportunityDetailPage() {
  const params = useParams();
  const opportunityId = params.id as string;

  const {
    data: opportunity,
    isLoading,
    error,
  } = trpc.opportunities.getOpportunity.useQuery(opportunityId, {
    enabled: !!opportunityId,
  });

  if (!opportunityId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Invalid opportunity ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">
          Error loading opportunity. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 justify-center ">
          <PostContent opportunity={opportunity} />
          <Sidebar opportunity={opportunity} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
