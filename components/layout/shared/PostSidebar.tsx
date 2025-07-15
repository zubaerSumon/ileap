"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Globe, Eye } from "lucide-react";
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
    <div className="w-full lg:w-[350px] space-y-6">
      {/* Organization Profile Section */}
      <div className="space-y-4">
        {/* Organization Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
            <Image
              src={orgImage}
              alt={orgName}
              fill
              className="object-cover rounded-full border-2 border-gray-200"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base md:text-lg text-gray-900 break-words mb-1">{orgName}</h3>
            {orgProfile.area && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{formatText(orgProfile.area, orgProfile.state)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {userRole === "volunteer" && orgProfile?._id && (
          <div className="relative">
            <Link href={`/view-profile/organisation/details/${orgProfile._id.toString()}`}>
              <Button 
                className="w-full h-10 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-0"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Full Profile
                <span className="ml-2 text-xs opacity-90">→</span>
              </Button>
            </Link>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg blur opacity-0 hover:opacity-20 transition-opacity duration-200 pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {(orgProfile.contact_email || orgProfile.phone_number || orgProfile.website) && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Get in Touch</p>
          
          <div className="space-y-2">
            {orgProfile.contact_email && (
              <a 
                href={`mailto:${orgProfile.contact_email}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                    {orgProfile.contact_email}
                  </p>
                </div>
              </a>
            )}

            {orgProfile.phone_number && (
              <a 
                href={`tel:${orgProfile.phone_number}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-green-600">
                    {orgProfile.phone_number}
                  </p>
                </div>
              </a>
            )}

            {orgProfile.website && (
              <a
                href={orgProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 truncate">
                    {orgProfile.website.replace(/^https?:\/\//, '')}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Organization Bio */}
      {orgProfile.bio && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">About</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {orgProfile.bio.length > 120 
              ? `${orgProfile.bio.substring(0, 120)}...` 
              : orgProfile.bio
            }
          </p>
          {orgProfile.bio.length > 120 && userRole === "volunteer" && orgProfile?._id && (
            <Link href={`/view-profile/organisation/details/${orgProfile._id.toString()}`}>
              <span className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                Read more
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
