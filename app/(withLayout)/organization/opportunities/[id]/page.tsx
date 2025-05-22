"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileSpreadsheet,
  Hand,
  MessageCircleCode,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PostContent } from "@/components/layout/organization/opportunities/PostContent";
import { Sidebar } from "@/components/layout/organization/opportunities/Sidebar";
import { ApplicantsCard } from "@/components/layout/organization/opportunities/ApplicantsCard";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";
import VolunteerModal from "@/components/layout/organization/opportunities/VolunteerModal";
import { useState } from "react";

export default function OpportunityDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: opportunity,
    isLoading,
    error,
  } = trpc.opportunities.getOpportunity.useQuery(opportunityId, {
    enabled: !!opportunityId,
  });

  const {
    data: applicants,
    isLoading: isLoadingApplicants,
  } = trpc.applications.getOpportunityApplicants.useQuery(
    { opportunityId },
    { enabled: !!opportunityId }
  );

  if (isLoading || isLoadingApplicants) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] py-12">
          <div className="w-[1048px] mx-auto bg-white rounded-xl min-h-screen p-8">
            Loading...
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error || !opportunity) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] py-12">
          <div className="w-[1048px] mx-auto bg-white rounded-xl min-h-screen p-8">
            Error loading opportunity
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] py-12">
        <div className="w-[1048px] mx-auto bg-white rounded-xl min-h-screen ">
          <div className="p-8">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2 cursor-pointer mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center justify-between">
                <h1 className="text-[20px] font-semibold">
                  {opportunity.title}
                </h1>
              </div>
            </div>
            <Tabs defaultValue="post" className="mb-8">
              <TabsList className="grid w-full grid-cols-3  p-0 bg-gray-100  rounded-full h-10">
                <TabsTrigger
                  value="post"
                  className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
                >
                  <FileSpreadsheet />
                  Post Details
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
                >
                  <MessageCircleCode />
                  Review Applications
                </TabsTrigger>
                <TabsTrigger
                  value="recruits"
                  className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
                >
                  <Hand />
                  Recruits
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="mt-6">
                <div className="flex gap-8">
                  <PostContent opportunity={opportunity} />
                  <div className="w-[1px] bg-[#F1F1F1]"></div>
                  <Sidebar opportunity={opportunity} />
                </div>
              </TabsContent>

              <TabsContent value="recruits" className="mt-6">
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex justify-between gap-3">
                      <div className="relative max-w-[333px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input
                          placeholder="Search volunteers"
                          className="pl-10 bg-gray-50 border-0"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="h-10 px-4 flex items-center gap-2"
                      >
                        <SlidersHorizontal />
                        Filter
                      </Button>
                    </div>
                    <div className="w-full border-b border-[#F1F1F1]" />
                  </div>
                  {applicants?.map((applicant) => (
                    <ApplicantsCard 
                      key={applicant.id} 
                      setIsModalOpen={setIsModalOpen} 
                      hideRecruitButton={true}
                      applicant={applicant}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="review" className="mt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex gap-8 text-sm">
                      <button className="text-[#246BFD] border-b-2 border-[#246BFD]">
                        All (15)
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        Saved (2)
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        Messaged (3)
                      </button>
                    </div>
                    <div className="w-full border-b border-[#F1F1F1]" />
                    <div className="flex justify-between gap-3 ">
                      <div className="relative max-w-[333px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input
                          placeholder="Search volunteers"
                          className="pl-10 bg-gray-50 border-0"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="h-10 px-4 flex items-center gap-2"
                      >
                        <SlidersHorizontal />
                        Filter
                      </Button>
                    </div>
                  </div>
                  {applicants?.map((applicant) => (
                    <ApplicantsCard 
                      key={applicant.id} 
                      setIsModalOpen={setIsModalOpen} 
                      applicant={applicant}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <VolunteerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </ProtectedLayout>
  );
}
