"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileSpreadsheet,
  Hand,
  MessageCircleCode,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PostContent } from "@/components/layout/organization/opportunities/PostContent";
import { Sidebar } from "@/components/layout/organization/opportunities/Sidebar";
import {
  Applicant,
  ApplicantsCard,
} from "@/components/layout/organization/opportunities/ApplicantsCard";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { trpc } from "@/utils/trpc";
import VolunteerModal from "@/components/layout/organization/opportunities/VolunteerModal";
import { useState } from "react";
import MessageApplicantModal from "@/components/layout/organization/opportunities/MessageApplicantModal";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function OpportunityDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  );
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [isGroupMessageModalOpen, setIsGroupMessageModalOpen] = useState(false);
  const [groupMessage, setGroupMessage] = useState("");
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);

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
      // Redirect to messages page
      router.push("/organization/messages");
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

    const memberIds = recruitedApplicants.map(applicant => applicant.id);
    const groupName = `${opportunity?.title} Volunteers`;

    createGroupMutation.mutate({
      name: groupName,
      description: `Group for volunteers of ${opportunity?.title}`,
      memberIds,
    });
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

  if (isLoading || isLoadingApplicants || isLoadingRecruitedApplicants) {
    return (
      <ProtectedLayout>
        <div className="bg-[#F5F7FA] py-12">
          <div className="w-[1240px] mx-auto bg-white rounded-xl min-h-screen p-8">
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
          <div className="w-[1240px] mx-auto bg-white rounded-xl min-h-screen p-8">
            Error loading opportunity
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] border py-12">
        <div className="w-[1240px] mx-auto bg-white rounded-xl min-h-screen ">
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
                  Applicants ({applicants?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="recruits"
                  className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
                >
                  <Hand />
                  Recruits ({recruitedApplicants?.length || 0})
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="h-10 px-4 flex items-center gap-2"
                          onClick={handleCreateGroup}
                          disabled={!recruitedApplicants?.length}
                        >
                          <Users className="w-4 h-4" />
                          Create Group
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 px-4 flex items-center gap-2"
                        >
                          <SlidersHorizontal />
                          Filter
                        </Button>
                      </div>
                    </div>
                    <div className="w-full border-b border-[#F1F1F1]" />
                  </div>
                  {recruitedApplicants?.map((applicant) => (
                    <ApplicantsCard
                      key={applicant.id}
                      setIsModalOpen={setIsModalOpen}
                      hideRecruitButton={true}
                      applicant={applicant}
                      setSelectedApplicantId={setSelectedApplicantId}
                      onMessageClick={() => handleOpenMessageModal(applicant)}
                    />
                  ))}
                  {recruitedApplicants?.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No recruited volunteers yet
                    </div>
                  )}
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
                      setSelectedApplicantId={setSelectedApplicantId}
                      onMessageClick={() => handleOpenMessageModal(applicant)}
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
        volunteer={
          applicants?.find((a) => a.id === selectedApplicantId) || null
        }
      />
      <MessageApplicantModal
        isOpen={isMessageModalOpen}
        onClose={handleCloseMessageModal}
        applicant={selectedApplicant}
      />
      <Dialog open={isGroupMessageModalOpen} onOpenChange={setIsGroupMessageModalOpen}>
        <DialogContent>
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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsGroupMessageModalOpen(false);
                  router.push("/messages");
                }}
              >
                Skip
              </Button>
              <Button
                onClick={handleSendGroupMessage}
                disabled={!groupMessage.trim() || sendGroupMessageMutation.isPending}
              >
                {sendGroupMessageMutation.isPending ? "Sending..." : "Send & Go to Messages"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedLayout>
  );
}
