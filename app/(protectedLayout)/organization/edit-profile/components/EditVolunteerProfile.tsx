'use client';

import Image from "next/image";
import { EditProfileSidebar } from "./EditProfileSidebar";
import { EditCompletedOpportunities } from "./EditCompletedOpportunities";

export function EditVolunteerProfile() {
  return (
    <div className="max-w-[1012px] mx-auto px-6">
      <div className="relative h-48 rounded-[12px] overflow-hidden">
        <Image
          src="/pfbg2.svg"
          alt="Profile background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-6 left-6">
          <div className="relative w-14 h-14 rounded-[12px]">
            <Image
              src="/pf.svg"
              alt="Volunteer"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        <EditProfileSidebar />
        <div className="w-[1px] bg-gray-200"></div>
        <EditCompletedOpportunities />
      </div>
    </div>
  );
}