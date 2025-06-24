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
    <div className="w-[350px] space-y-4">
      {/* Organization Information Card */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12">
            <Image
              src={orgImage}
              alt={orgName}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold">{orgName}</h3>
            <p className="text-sm text-gray-500">
              {opportunity.commitment_type === 'workbased' ? 'Work based' : 'Event based'} Opportunity
            </p>
          </div>
        </div>

        {/* Opportunity Details */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </h4>
            <p className="text-sm text-gray-600">{opportunity.location}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Available Spots
            </h4>
            <p className="text-sm text-gray-600">{opportunity.number_of_volunteers} spots</p>
          </div>

          {opportunity.date?.start_date && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
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
              <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time
              </h4>
              <p className="text-sm text-gray-600">{formatTimeToAMPM(opportunity.time.start_time)}</p>
            </div>
          )}
        </div>

        {/* View Organization Profile Button - Only show for volunteers */}
        {userRole === 'volunteer' && orgProfile?._id && (
          <div className="mt-4 pt-4 border-t">
            <Link href={`/volunteer/organizer/${orgProfile._id.toString()}`}>
              <Button variant="outline" className="w-full">
                View Organization Profile
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Organization Contact Information Card */}
      {orgProfile && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Organization Information</h3>
          <div className="space-y-3">
            {orgProfile.contact_email && (
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>{orgProfile.contact_email}</span>
              </div>
            )}
            
            {orgProfile.phone_number && (
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span>{orgProfile.phone_number}</span>
              </div>
            )}
            
            {orgProfile.website && (
              <div className="flex items-center text-sm">
                <Globe className="w-4 h-4 mr-2 text-gray-500" />
                <a 
                  href={orgProfile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {orgProfile.website}
                </a>
              </div>
            )}
            
            {orgProfile.area && (
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                <span>{orgProfile.area}, {orgProfile.state}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Similar Opportunities Card - Only show for volunteers */}
      {userRole === 'volunteer' && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Similar Opportunities</h3>
          <div className="space-y-3">
            {/* Similar opportunities will be populated dynamically */}
            <p className="text-sm text-gray-600">No similar opportunities found.</p>
          </div>
        </Card>
      )}
    </div>
  );
} 