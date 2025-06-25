"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Mail, Phone, Globe, Calendar, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IOpportunity } from "@/server/db/interfaces/opportunity";
import { IOrgnizationPofile } from "@/server/db/interfaces/organization-profile";
import { Types } from "mongoose";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";

interface OpportunitySidebarProps {
  opportunity: IOpportunity & {
    organization_profile: IOrgnizationPofile;
  };
  userRole?: 'volunteer' | 'organization';
}

// Type for organization profile that can handle both populated and unpopulated cases
type OrganizationProfileData = IOrgnizationPofile & {
  _id: string | Types.ObjectId;
  title?: string;
  name?: string;
};

export function OpportunitySidebar({ opportunity, userRole = 'volunteer' }: OpportunitySidebarProps) {
  // Handle both populated and unpopulated organization_profile
  const orgProfile = opportunity.organization_profile as unknown as OrganizationProfileData;
  const orgName = orgProfile?.title || orgProfile?.name || 'Organization';
  const orgImage = orgProfile?.profile_img || '/avatar.svg';

  return (
    <div className="w-full lg:w-[350px] space-y-4">
    <div className="w-full lg:w-[350px] space-y-4">
      {/* Organization Information Card */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4 text-center md:text-left">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <Image
              src={orgImage}
              alt={orgName}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">{orgName}</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {opportunity.commitment_type === 'workbased' ? 'Work based' : 'Event based'} Opportunity
            </p>
          </div>
        </div>

        {/* Opportunity Details */}
        <div className="space-y-3 text-center md:text-left">
          <div>
            <h4 className="text-sm font-medium mb-1 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </h4>
            <p className="text-sm text-gray-600 break-words">{opportunity.location}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1 flex items-center justify-center md:justify-start gap-2">
              <Users className="w-4 h-4" />
              Available Spots
            </h4>
            <p className="text-sm text-gray-600">{opportunity.number_of_volunteers} spots</p>
          </div>

          {opportunity.date?.start_date && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center justify-center md:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </h4>
              <p className="text-sm text-gray-600">
                {new Date(opportunity.date.start_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}

          {opportunity.time?.start_time && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center justify-center md:justify-start gap-2">
                <Clock className="w-4 h-4" />
                Start Time
              </h4>
              <p className="text-sm text-gray-600">{formatTimeToAMPM(opportunity.time.start_time)}</p>
            </div>
          )}
        </div>

        {/* View Organization Profile Button - Only show for volunteers */}
        {userRole === 'volunteer' && orgProfile?._id && (
          <div className="mt-4 pt-4 border-t flex justify-center md:justify-start">
            <Link href={`/volunteer/organizer/${orgProfile._id.toString()}`}>
              <Button variant="outline" className="w-full md:w-auto">
                View Organization Profile
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Organization Contact Information Card */}
      {orgProfile && (
        <Card className="p-3 md:p-4">
          <h3 className="font-semibold mb-3 text-sm md:text-base text-center md:text-left">Organization Information</h3>
          <div className="space-y-3 text-center md:text-left">
            {orgProfile.contact_email && (
              <div className="flex items-center justify-center md:justify-start text-sm">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-xs md:text-sm">{orgProfile.contact_email}</span>
              </div>
            )}
            
            {orgProfile.phone_number && (
              <div className="flex items-center justify-center md:justify-start text-sm">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-xs md:text-sm">{orgProfile.phone_number}</span>
              </div>
            )}
            
            {orgProfile.website && (
              <div className="flex items-center justify-center md:justify-start text-sm">
                <Globe className="w-4 h-4 mr-2 text-gray-500" />
                <a 
                  href={orgProfile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs md:text-sm"
                >
                  {orgProfile.website}
                </a>
              </div>
            )}
            
            {orgProfile.area && (
              <div className="flex items-start justify-center md:justify-start text-sm">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                <span className="text-xs md:text-sm">{orgProfile.area}, {orgProfile.state}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Similar Opportunities Card - Only show for volunteers */}
      {userRole === 'volunteer' && (
        <Card className="p-3 md:p-4">
          <h3 className="font-semibold mb-3 text-sm md:text-base text-center md:text-left">Similar Opportunities</h3>
          <div className="space-y-3 text-center md:text-left">
            {/* Similar opportunities will be populated dynamically */}
            <p className="text-sm text-gray-600">No similar opportunities found.</p>
          </div>
        </Card>
      )}
    </div>
  );
} 