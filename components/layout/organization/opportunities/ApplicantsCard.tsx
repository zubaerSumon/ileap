"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Star, UserCheck, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server";
import { useRecruitmentStatus } from "@/hooks/useRecruitmentStatus";

export interface Applicant {
  id: string;
  name: string;
  profileImg: string;
  location: string;
  bio: string;
  skills: string[];
  completedProjects: number;
  availability: string;
  applicationId: string;
}

export function ApplicantsCard({
  setIsModalOpen,
  hideRecruitButton = false,
  applicant,
  setSelectedApplicantId,
  onMessageClick,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
  hideRecruitButton?: boolean;
  applicant: Applicant;
  setSelectedApplicantId: (id: string) => void;
  onMessageClick: () => void;
}) {
  const utils = trpc.useUtils();
  const { isRecruited, refetchRecruitmentStatus } = useRecruitmentStatus(
    applicant.applicationId,
    !hideRecruitButton
  );

  const recruitMutation = trpc.recruits.recruitApplicant.useMutation({
    onSuccess: () => {
      toast.success("Applicant has been recruited successfully.");
      setIsModalOpen(false);
      refetchRecruitmentStatus();
      utils.recruits.getRecruitedApplicants.invalidate();
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message);
    },
  });

  const handleRecruit = () => {
    recruitMutation.mutate({
      applicationId: applicant.applicationId,
    });
  };

  const handleViewProfile = () => {
    setSelectedApplicantId(applicant.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="relative w-[34px] h-[34px] shrink-0">
                <Image
                  src={applicant.profileImg}
                  alt={`${applicant.name}'s avatar`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="font-medium">{applicant.name}</h3>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {applicant.location}
              </div>
              <div className="flex items-center gap-1">
                <HiClipboardDocumentList className="w-4 h-4 text-blue-600" />
                {applicant.completedProjects} projects completed
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <UserCheck className="w-4 h-4 " />
                {applicant.availability}
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <UserCheck className="w-4 h-4 " /> {applicant.skills.length}{" "}
                matched skills
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              {applicant.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-3">{applicant.bio}</p>

            <div className="flex gap-3 mt-4">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-3 min-w-[56px]"
                  onClick={handleViewProfile}
                >
                  <Star className="w-6 h-6 text-yellow-400" />
                </Button>
                {!hideRecruitButton && (
                  <Button
                    variant="ghost"
                    size="lg"
                    className={`rounded-[6px] px-6 font-normal ${
                      isRecruited
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={handleRecruit}
                    disabled={recruitMutation.isPending || isRecruited}
                  >
                    {recruitMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Recruiting...
                      </div>
                    ) : isRecruited ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Recruited
                      </div>
                    ) : (
                      "Recruit"
                    )}
                  </Button>
                )}
              </div>
              <Button
                size="lg"
                className="bg-[#246BFD] hover:bg-[#246BFD]/90 text-white px-6 rounded-[6px]"
                onClick={onMessageClick}
              >
                Send message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
