"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IOrgnizationPofile } from "@/server/db/interfaces/organization-profile";
import { Types } from "mongoose";
import { formatText } from "@/utils/helpers/formatText";

interface PostSidebarProps {
  organization_profile: IOrgnizationPofile;
  userRole?: "volunteer" | "organization";
}

// Type for organization profile that can handle both populated and unpopulated cases
type OrganizationProfileData = IOrgnizationPofile & {
  _id: string | Types.ObjectId;
  title?: string;
  name?: string;
};

export function PostSidebar({
  organization_profile,
  userRole = "volunteer",
}: PostSidebarProps) {
  // Handle both populated and unpopulated organization_profile
  const orgProfile = organization_profile as unknown as OrganizationProfileData;
  const orgName = orgProfile?.title || orgProfile?.name || "Organization";
  const orgImage = orgProfile?.profile_img || "/avatar.svg";

  return (
    <div className="w-full lg:w-[350px] space-y-4">
      {/* Organization Information Card */}
      <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col items-center gap-3 text-center mb-4">
          <div className="relative w-12 h-12 md:w-14 md:h-14">
            <Image
              src={orgImage}
              alt={orgName}
              fill
              className="object-cover rounded-full border-2 border-gray-200"
            />
          </div>
          <div className="w-full">
            <h3 className="font-semibold text-base md:text-lg text-gray-800 break-words">{orgName}</h3>
          </div>
        </div>

        {/* Organization Details */}
        <div className="space-y-3">
          {orgProfile.area && (
            <div className="flex items-start gap-2 sm:items-center">
              <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-800 break-words">
                  {formatText(orgProfile.area, orgProfile.state)}
                </p>
              </div>
            </div>
          )}

          {orgProfile.contact_email && (
            <div className="flex items-start gap-2 sm:items-center">
              <Mail className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <a 
                  href={`mailto:${orgProfile.contact_email}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {orgProfile.contact_email}
                </a>
              </div>
            </div>
          )}

          {orgProfile.phone_number && (
            <div className="flex items-start gap-2 sm:items-center">
              <Phone className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Phone</p>
                <a 
                  href={`tel:${orgProfile.phone_number}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {orgProfile.phone_number}
                </a>
              </div>
            </div>
          )}

          {orgProfile.website && (
            <div className="flex items-start gap-2 sm:items-center">
              <Globe className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Website</p>
                <a
                  href={orgProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {orgProfile.website}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* View Organization Profile Button - Only show for volunteers */}
        {userRole === "volunteer" && orgProfile?._id && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <Link href={`/volunteer/organizer/${orgProfile._id.toString()}`}>
              <Button 
                variant="outline" 
                className="w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-800 hover:border-gray-400 text-sm md:text-base"
              >
                View Organization Profile
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
