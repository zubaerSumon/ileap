"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Star, UserCheck } from "lucide-react";
import Image from "next/image";
import { HiClipboardDocumentList } from "react-icons/hi2";

interface Applicant {
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
}: {
  setIsModalOpen: (isOpen: boolean) => void;
  hideRecruitButton?: boolean;
  applicant: Applicant;
}) {
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
                <UserCheck className="w-4 h-4 " /> {applicant.skills.length} matched skills
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

            <p className="text-sm text-gray-600 mt-3">
              {applicant.bio}
            </p>

            <div className="flex gap-3 mt-4">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-3 min-w-[56px]"
                >
                  <Star className="w-6 h-6 text-yellow-400" />
                </Button>
                {!hideRecruitButton && (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-6 font-normal"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Recruit
                  </Button>
                )}
              </div>
              <Button
                size="lg"
                className="bg-[#246BFD] hover:bg-[#246BFD]/90 text-white px-6 rounded-[6px]"
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
