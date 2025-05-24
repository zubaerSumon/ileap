"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export interface Applicant {
  id: string;
  name: string;
  bio: string;
  location: string;
  profileImg: string;
  skills: string[];
  completedProjects: number;
  availability: string;
  applicationId: string;
  state: string;
  area: string;
  postcode: string;
  interested_on: string[];
}

interface ApplicantsCardProps {
  applicant: Applicant;
  setIsModalOpen: (isOpen: boolean) => void;
  onMessageClick: () => void;
  hideRecruitButton?: boolean;
}

export function ApplicantsCard({ 
  applicant, 
  setIsModalOpen, 
  onMessageClick,
  hideRecruitButton = false 
}: ApplicantsCardProps) {
  const formatLocation = () => {
    const parts = [];
    if (applicant.area) parts.push(applicant.area);
    if (applicant.state) parts.push(applicant.state);
    if (applicant.postcode) parts.push(applicant.postcode);
    return parts.join(", ");
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
      <div className="relative w-[34px] h-[34px] shrink-0">
        <Image
          src={applicant.profileImg}
          alt={`${applicant.name}'s avatar`}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{applicant.name}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMessageClick}
              className="text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            {!hideRecruitButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Recruit
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{applicant.bio}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {applicant.interested_on?.map((interest) => (
            <span
              key={interest}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
            >
              {interest.replace(/_/g, " ")}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {applicant.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-gray-100 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <p>Location: {formatLocation()}</p>
          <p>Completed Projects: {applicant.completedProjects}</p>
          <p>Availability: {applicant.availability}</p>
        </div>
      </div>
    </div>
  );
}
