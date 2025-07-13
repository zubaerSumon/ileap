"use client";

import { useState } from "react";
import { Users, FileSpreadsheet, MessageCircleCode, Hand } from "lucide-react";
import Loading from "@/app/loading";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";
import { DynamicTabs, TabItem } from "@/components/layout/shared/DynamicTabs";
import BackButton from "@/components/buttons/BackButton";
import { OpportunityDetail } from "@/components/layout/volunteer/home-page/OpportunityDetail";
import { ApplicantsTab } from "./tabs/ApplicantsTab";
import { CreateGroupModal } from "./modals/CreateGroupModal";
import { RecruitsTab } from "./tabs/RecruitsTab";
import { GroupMessageModal } from "./modals/GroupMessageModal";
import NotFound from "@/app/not-found";

interface OpportunityDetailContainerProps {
  userRole: "volunteer" | "organisation";
}

export default function OpportunityDetailContainer({
  userRole,
}: OpportunityDetailContainerProps) {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const opportunityId = params.id as string;

  // State management
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isGroupMessageModalOpen, setIsGroupMessageModalOpen] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);

  // Queries
  const {
    data: opportunity,
    isLoading,
    error,
  } = trpc.opportunities.getOpportunity.useQuery(opportunityId, {
    enabled: !!opportunityId,
  });

  const { data: opportunityMentors } =
    trpc.mentors.getOpportunityMentors.useQuery(
      { opportunityId },
      { enabled: !!opportunityId }
    );

  const { data: applicants } =
    trpc.applications.getOpportunityApplicants.useQuery(
      { opportunityId },
      { enabled: !!opportunityId }
    );

  const { data: recruitedApplicants } =
    trpc.recruits.getRecruitedApplicants.useQuery(
      { opportunityId },
      { enabled: !!opportunityId }
    );

  // Check if current user is a mentor for this opportunity
  const isCurrentUserMentor = opportunityMentors?.some(
    (mentor) => mentor.volunteer._id === session?.user?.id
  );

  // Error and loading states
  if (!opportunityId) {
    return (
      <ProtectedLayout>
        <NotFound />
      </ProtectedLayout>
    );
  }

  if (isLoading) {
    return (
      <ProtectedLayout>
        <Loading size="medium">
          <p className="text-gray-600 mt-2">Wait a sec...</p>
        </Loading>
      </ProtectedLayout>
    );
  }

  if (error || !opportunity) {
    return (
      <ProtectedLayout>
        <NotFound />
      </ProtectedLayout>
    );
  }

  // Tab content
  const postContent = (
    <OpportunityDetail opportunity={opportunity} userRole={userRole} />
  );

  const applicantsContent = (
    <ApplicantsTab
      key={`applicants-${opportunityId}`}
      opportunityId={opportunityId}
      userRole={userRole}
      isCurrentUserMentor={isCurrentUserMentor || false}
      currentUserId={session?.user?.id}
    />
  );

  const recruitsContent = (
    <RecruitsTab
      key={`recruits-${opportunityId}`}
      opportunityId={opportunityId}
      userRole={userRole}
      isCurrentUserMentor={isCurrentUserMentor || false}
      currentUserId={session?.user?.id}
      onCreateGroup={() => setIsCreateGroupModalOpen(true)}
    />
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

  const shouldShowTabs =
    (userRole === "volunteer" && isCurrentUserMentor) ||
    userRole === "organisation";

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
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
                {userRole === "volunteer" && isCurrentUserMentor && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">
                      Mentor View
                    </span>
                  </div>
                )}
              </div>
            </div>
            {shouldShowTabs ? (
              <DynamicTabs
                defaultValue="post"
                tabs={tabs}
                className="mb-6 sm:mb-8"
              />
            ) : (
              <OpportunityDetail
                opportunity={opportunity}
                userRole={userRole}
              />
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onGroupCreated={(groupId) => {
          setCreatedGroupId(groupId);
          setIsGroupMessageModalOpen(true);
        }}
      />

      <GroupMessageModal
        isOpen={isGroupMessageModalOpen}
        onClose={() => setIsGroupMessageModalOpen(false)}
        groupId={createdGroupId}
        onMessageSent={() => {
          setIsGroupMessageModalOpen(false);
          router.push(
            userRole === "organisation" ? "/organisation/messages" : "/messages"
          );
        }}
      />
    </ProtectedLayout>
  );
}
