"use client";

import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Hand,
  MessageCircleCode,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PostContent } from "@/components/layout/organisation/opportunities/PostContent";
import { OpportunitySidebar } from "@/components/layout/shared/OpportunitySidebar";
import {
  Applicant,
  ApplicantsCard,
} from "@/components/layout/organisation/opportunities/ApplicantsCard";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import MessageApplicantModal from "@/components/layout/organisation/opportunities/MessageApplicantModal";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import BackButton from "@/components/buttons/BackButton";
import { DynamicTabs, TabItem } from "@/components/layout/shared/DynamicTabs";

export default function OpportunityDetailsPage() {
  const utils = trpc.useUtils();
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [isGroupMessageModalOpen, setIsGroupMessageModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [groupMessage, setGroupMessage] = useState("");
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);
  const [applicantsSearchQuery, setApplicantsSearchQuery] = useState("");
  const [recruitsSearchQuery, setRecruitsSearchQuery] = useState("");

  const {
    data: opportunity,
    isLoading,
    error,
  } = trpc.opportunities.getOpportunity.useQuery(opportunityId, {
    enabled: !!opportunityId,
  });

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

  const createGroupMutation = trpc.messages.createGroup.useMutation({
    onSuccess: (data) => {
      toast.success("Group created successfully!");
      setCreatedGroupId(data._id);
      setIsGroupMessageModalOpen(true);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create group");
    },
  });

  const sendGroupMessageMutation = trpc.messages.sendGroupMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setIsGroupMessageModalOpen(false);
      setGroupMessage("");
      utils.messages.getGroups.invalidate();
      // Redirect to messages page
      router.push("/organisation/messages");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const handleCreateGroup = () => {
    if (!recruitedApplicants?.length) {
      toast.error("No recruited volunteers to create a group");
      return;
    }
    setIsCreateGroupModalOpen(true);
  };

  const handleConfirmCreateGroup = () => {
    const memberIds = recruitedApplicants?.map(applicant => applicant.id) || [];
    const groupName = `${opportunity?.title} Volunteers`;

    createGroupMutation.mutate({
      name: groupName,
      description: `Group for volunteers of ${opportunity?.title}`,
      memberIds,
    });
    setIsCreateGroupModalOpen(false);
  };

  const handleSendGroupMessage = () => {
    if (!createdGroupId || !groupMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    sendGroupMessageMutation.mutate({
      groupId: createdGroupId,
      content: groupMessage,
    });
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleOpenMessageModal = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsMessageModalOpen(true);
  };

  // Filter applicants based on search query
  const filteredApplicants = applicants?.filter((applicant) =>
    applicant.name.toLowerCase().includes(applicantsSearchQuery.toLowerCase()) ||
    applicant.location.toLowerCase().includes(applicantsSearchQuery.toLowerCase()) ||
    applicant.skills.some(skill => skill.toLowerCase().includes(applicantsSearchQuery.toLowerCase()))
  );

  // Filter recruited applicants based on search query
  const filteredRecruitedApplicants = recruitedApplicants?.filter((applicant) =>
    applicant.name.toLowerCase().includes(recruitsSearchQuery.toLowerCase()) ||
    applicant.location.toLowerCase().includes(recruitsSearchQuery.toLowerCase()) ||
    applicant.skills.some(skill => skill.toLowerCase().includes(recruitsSearchQuery.toLowerCase()))
  );

  // Define tab content
  const postContent = (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <div className="flex-1">
        <PostContent opportunity={opportunity} />
      </div>
      <div className="hidden lg:block w-[1px] bg-[#F1F1F1]"></div>
      <div className="lg:w-[350px] flex-shrink-0">
        <OpportunitySidebar opportunity={opportunity} userRole="organization" />
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
            <SlidersHorizontal />
            Filter
          </Button>
        </div>
      </div>
      {filteredApplicants?.map((applicant) => (
        <ApplicantsCard
          key={applicant.id}
          applicant={applicant}
          onMessageClick={() => handleOpenMessageModal(applicant)}
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
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="h-10 px-4 flex items-center gap-2 w-full sm:w-auto"
              onClick={handleCreateGroup}
              disabled={!recruitedApplicants?.length}
            >
              <Users className="w-4 h-4" />
              Create Group
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 flex items-center gap-2 w-full sm:w-auto"
            >
              <SlidersHorizontal />
              Filter
            </Button>
          </div>
        </div>
        <div className="w-full border-b border-[#F1F1F1]" />
      </div>
      {filteredRecruitedApplicants?.map((applicant) => (
        <ApplicantsCard
          key={applicant.id}
          applicant={applicant}
          onMessageClick={() => handleOpenMessageModal(applicant)}
          hideRecruitButton
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

  if (isLoading || isLoadingApplicants || isLoadingRecruitedApplicants) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] py-6 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl min-h-screen p-4 sm:p-8">
              Loading...
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
              Error loading opportunity
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

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
      <Dialog open={isGroupMessageModalOpen} onOpenChange={setIsGroupMessageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Welcome Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your welcome message to the group..."
              value={groupMessage}
              onChange={(e) => setGroupMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsGroupMessageModalOpen(false);
                  router.push("/messages");
                }}
                className="w-full sm:w-auto"
              >
                Skip
              </Button>
              <Button
                onClick={handleSendGroupMessage}
                disabled={!groupMessage.trim() || sendGroupMessageMutation.isPending}
                className="w-full sm:w-auto"
              >
                {sendGroupMessageMutation.isPending ? "Sending..." : "Send & Go to Messages"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Create a group with all the recruited volunteers for this opportunity?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateGroupModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmCreateGroup}
                disabled={createGroupMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createGroupMutation.isPending ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedLayout>
  );
}
