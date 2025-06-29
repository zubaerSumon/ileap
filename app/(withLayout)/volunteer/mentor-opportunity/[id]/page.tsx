"use client";

import { useState } from "react";
import { Loader2, FileSpreadsheet, MessageCircleCode, Hand, Search, Users } from "lucide-react";
import { PostContent } from "@/components/layout/volunteer/home-page/PostContent";
import { OpportunitySidebar } from "@/components/layout/shared/OpportunitySidebar";
import { useParams, useRouter } from "next/navigation";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DynamicTabs, TabItem } from "@/components/layout/shared/DynamicTabs";
import { Applicant, ApplicantsCard } from "@/components/layout/organisation/opportunities/ApplicantsCard";
import MessageApplicantModal from "@/components/layout/organisation/opportunities/MessageApplicantModal";
import Image from "next/image";
import BackButton from "@/components/buttons/BackButton";
import { useSession } from "next-auth/react";

export default function MentorOpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const opportunityId = params.id as string;
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [applicantsSearchQuery, setApplicantsSearchQuery] = useState("");
  const [recruitsSearchQuery, setRecruitsSearchQuery] = useState("");

  const {
    data: opportunity,
    isLoading,
    error,
  } = trpc.opportunities.getOpportunity.useQuery(opportunityId, {
    enabled: !!opportunityId,
  });

  // Check if current user is a mentor for this opportunity
  const { data: opportunityMentors } = trpc.mentors.getOpportunityMentors.useQuery(
    { opportunityId },
    { enabled: !!opportunityId }
  );

  const { data: applicants, isLoading: isLoadingApplicants } =
    trpc.applications.getOpportunityApplicants.useQuery(
      { opportunityId },
      { enabled: !!opportunityId }
    );

  const { data: recruitedApplicants, isLoading: isLoadingRecruitedApplicants } =
    trpc.recruits.getRecruitedApplicants.useQuery(
      { opportunityId },
      { enabled: !!opportunityId }
    );

  // Check if current user is a mentor for this opportunity
  const isCurrentUserMentor = opportunityMentors?.some(
    (mentor) => mentor.volunteer._id === session?.user?.id
  );

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleOpenMessageModal = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsMessageModalOpen(true);
  };

  // Filter applicants based on search query and exclude current mentor
  const filteredApplicants = applicants?.filter((applicant) => {
    // Exclude current user if they are a mentor
    if (applicant.id === session?.user?.id) {
      return false;
    }
    
    return applicant.name.toLowerCase().includes(applicantsSearchQuery.toLowerCase()) ||
      applicant.location.toLowerCase().includes(applicantsSearchQuery.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(applicantsSearchQuery.toLowerCase()));
  });

  // Filter recruited applicants based on search query and exclude current mentor
  const filteredRecruitedApplicants = recruitedApplicants?.filter((applicant) => {
    // Exclude current user if they are a mentor
    if (applicant.id === session?.user?.id) {
      return false;
    }
    
    return applicant.name.toLowerCase().includes(recruitsSearchQuery.toLowerCase()) ||
      applicant.location.toLowerCase().includes(recruitsSearchQuery.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(recruitsSearchQuery.toLowerCase()));
  });

  if (!opportunityId) {
    return (
      <ProtectedLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-600">Invalid opportunity ID.</p>
        </div>
      </ProtectedLayout>
    );
  }

  if (isLoading || isLoadingApplicants || isLoadingRecruitedApplicants) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] py-6 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl min-h-screen p-4 sm:p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error || !opportunity) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] py-6 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl min-h-screen p-4 sm:p-8">
              <p className="text-red-600">
                Error loading opportunity. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  // If user is not a mentor for this opportunity, redirect to dashboard
  if (!isCurrentUserMentor) {
    router.push("/volunteer/dashboard");
    return null;
  }

  // Define tab content for mentor view
  const postContent = (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <div className="flex-1">
        <PostContent opportunity={opportunity} />
      </div>
      <div className="hidden lg:block w-[1px] bg-[#F1F1F1]"></div>
      <div className="lg:w-[350px] flex-shrink-0">
        <OpportunitySidebar opportunity={opportunity} userRole="volunteer" />
      </div>
    </div>
  );

  const applicantsContent = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="w-full border-b border-[#F1F1F1]" />
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-1 max-w-[333px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search volunteers"
              className="pl-10 bg-gray-50 border-0"
              value={applicantsSearchQuery}
              onChange={(e) => setApplicantsSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-10 px-4 flex items-center gap-2 w-full sm:w-auto"
          >
            Filter
          </Button>
        </div>
      </div>
      {filteredApplicants?.map((applicant) => (
        <ApplicantsCard
          key={applicant.id}
          applicant={applicant}
          onMessageClick={() => handleOpenMessageModal(applicant)}
          opportunityId={opportunityId}
          showMarkAsMentor={true}
        />
      ))}
      {filteredApplicants?.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          {applicantsSearchQuery ? "No matching applicants found" : "No applicants yet"}
        </div>
      )}
    </div>
  );

  const recruitsContent = (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-1 max-w-[333px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search volunteers"
              className="pl-10 bg-gray-50 border-0"
              value={recruitsSearchQuery}
              onChange={(e) => setRecruitsSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-10 px-4 flex items-center gap-2 w-full sm:w-auto"
          >
            Filter
          </Button>
        </div>
        <div className="w-full border-b border-[#F1F1F1]" />
      </div>
      {filteredRecruitedApplicants?.map((applicant) => (
        <ApplicantsCard
          key={applicant.id}
          applicant={applicant}
          onMessageClick={() => handleOpenMessageModal(applicant)}
          hideRecruitButton={true}
          opportunityId={opportunityId}
          showMarkAsMentor={true}
        />
      ))}
      {filteredRecruitedApplicants?.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          {recruitsSearchQuery ? "No matching volunteers found" : "No recruited volunteers yet"}
        </div>
      )}
    </div>
  );

  const tabs: TabItem[] = [
    {
      value: "post",
      label: "Post Details",
      icon: <FileSpreadsheet />,
      content: postContent,
    },
    {
      value: "review",
      label: "Applicants",
      icon: <MessageCircleCode />,
      count: applicants?.length || 0,
      content: applicantsContent,
    },
    {
      value: "recruits",
      label: "Recruits",
      icon: <Hand />,
      count: recruitedApplicants?.length || 0,
      content: recruitsContent,
    },
  ];

  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] border py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl min-h-screen">
            <div className="p-4 sm:p-8">
              <div className="mb-6 sm:mb-8">
                <BackButton />
                <div className="w-full h-[150px] sm:h-[200px] relative mb-4 sm:mb-6">
                  <Image
                    src={opportunity.banner_img || "/fallbackbanner.png"}
                    alt={`${opportunity.title} Banner`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h1 className="text-lg sm:text-[20px] font-semibold">
                    {opportunity.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">Mentor View</span>
                  </div>
                </div>
              </div>
              <DynamicTabs defaultValue="post" tabs={tabs} className="mb-6 sm:mb-8" />
            </div>
          </div>
        </div>
      </div>
      <MessageApplicantModal
        isOpen={isMessageModalOpen}
        onClose={handleCloseMessageModal}
        applicant={selectedApplicant}
      />
    </ProtectedLayout>
  );
} 