"use client";

import { Separator } from "@/components/ui/separator";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";
import { IOpportunity } from "@/server/db/interfaces/opportunity";
import { IOrgnizationPofile } from "@/server/db/interfaces/organization-profile";

interface SidebarProps {
  opportunity: IOpportunity & {
    organization_profile: IOrgnizationPofile;
  };
}

export function Sidebar({ opportunity }: SidebarProps) {
  return (
    <div className="w-[300px]">
      {/* Organization Logo at Top */}
      <div className="py-4 rounded-lg mb-4">
        <div className="flex flex-col items-start">
          <Image
            src={opportunity.organization_profile.profile_img || "/avatar.svg"}
            alt={opportunity.organization_profile.title}
            width={80}
            height={80}
            className="rounded-full mb-3"
          />
          <h3 className="font-semibold text-lg">{opportunity.organization_profile.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {opportunity.organization_profile.bio || "Organization"}
          </p>
        </div>
      </div>

      <Separator />

      {/* <div className="py-4 rounded-lg mb-4 space-y-3 gap-y-3">
        {opportunity.start_date && (
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="font-medium">Start Date:</span>
              <span className="ml-2">
                {new Date(opportunity.start_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium">Start Time:</span>
              <span className="ml-2">{formatTimeToAMPM(opportunity.start_time)}</span>
            </div>
          </div>
        )}
      </div> */}

      <Separator />

      <div className="py-4 rounded-lg">
        <h3 className="font-semibold mb-3">Organisation Information</h3>
        <div className="space-y-3">
          {opportunity.organization_profile.contact_email && (
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              <span>{opportunity.organization_profile.contact_email}</span>
            </div>
          )}
          
          {opportunity.organization_profile.phone_number && (
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              <span>{opportunity.organization_profile.phone_number}</span>
            </div>
          )}
          
          {opportunity.organization_profile.website && (
            <div className="flex items-center text-sm">
              <Globe className="w-4 h-4 mr-2 text-gray-500" />
              <a 
                href={opportunity.organization_profile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {opportunity.organization_profile.website}
              </a>
            </div>
          )}
          
          {opportunity.organization_profile.area && (
            <div className="flex items-start text-sm">
              <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
              <span>{opportunity.organization_profile.area}, {opportunity.organization_profile.state}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
