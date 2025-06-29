"use client";

import { Button } from "@/components/ui/button";
import { MapPin,  UserCheck, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server";
import { useRecruitmentStatus } from "@/hooks/useRecruitmentStatus";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  onMessageClick,
}: {
  setIsModalOpen?: (isOpen: boolean) => void;
  hideRecruitButton?: boolean;
  applicant: Applicant;
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
      setIsModalOpen?.(false);
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg p-4 sm:p-6 border space-y-4 cursor-pointer hover:shadow-md transition-shadow">
        <Link href={`/volunteer/${applicant.id}/profile`} className="block">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="relative w-[34px] h-[34px] shrink-0">
                  <Image
                    src={applicant.profileImg}
                    alt={`${applicant.name}'s avatar`}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="font-medium truncate">{applicant.name}</h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex-shrink-0">
                  Verified
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{applicant.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiClipboardDocumentList className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{applicant.completedProjects} projects completed</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <UserCheck className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{applicant.availability}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <UserCheck className="w-4 h-4 flex-shrink-0" />
                  <span>{applicant.skills.length} matched skills</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{applicant.bio}</p>
            </div>
          </div>
        </Link>

        <div className={cn("flex flex-col sm:flex-row space-x-3 mt-4", !hideRecruitButton && "justify-between")}>
          <div className="flex space-x-2">
         
            {!hideRecruitButton && (
              <Button
                variant="ghost"
                size="lg"
                className={`rounded-[6px] px-4 sm:px-6 font-normal w-full sm:w-auto ${
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
            className="bg-[#246BFD] hover:bg-[#246BFD]/90 text-white px-4 sm:px-6 rounded-[6px] w-full sm:w-auto"
            onClick={onMessageClick}
          >
            Send message
          </Button>
        </div>
      </div>
    </div>
  );
}
