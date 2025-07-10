"use client";

import { PostContent } from "./PostContent";
import { trpc } from "@/utils/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";
import { formatText } from "@/utils/helpers/formatText";

type Opportunity = {
  _id: string;
  title: string;
  description: string;
  category: string[];
  required_skills: string[];
  commitment_type: string;
  location: string;
  number_of_volunteers: number;
  date: {
    start_date: Date;
    end_date?: Date;
  };
  time: {
    start_time: string;
    end_time?: string;
  };
  organization_profile: {
    _id: string;
    title: string;
    profile_img?: string;
    contact_email?: string;
    phone_number?: string;
    website?: string;
    area?: string;
    state?: string;
    bio?: string;
  };
  created_by?: {
    _id: string;
    name: string;
  };
  banner_img?: string;
  createdAt: Date;
};

interface OpportunityDetailProps {
  opportunity: Opportunity;
  userRole?: "volunteer" | "organization";
  isMentor?: boolean;
}

export function OpportunityDetail({ 
  opportunity, 
  userRole = "volunteer",
  isMentor = false 
}: OpportunityDetailProps) {
  // Fetch similar opportunities based on category and location
  const { data: similarOpportunities } = trpc.opportunities.getAllOpportunities.useQuery({
    page: 1,
    limit: 3,
  }, {
    enabled: userRole === "volunteer",
  });

  // Filter similar opportunities (same category or location, excluding current opportunity)
  const filteredSimilarOpportunities = similarOpportunities?.opportunities?.filter(
    (opp) => {
      const similarOpp = opp as unknown as Opportunity;
      return (
        similarOpp._id !== opportunity._id &&
        (similarOpp.category.some(cat => opportunity.category.includes(cat)) ||
         similarOpp.location.toLowerCase().includes(opportunity.location.toLowerCase()) ||
         opportunity.location.toLowerCase().includes(similarOpp.location.toLowerCase()))
      );
    }
  ).slice(0, 3) || [];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <PostContent opportunity={opportunity} isMentor={isMentor} />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-[1px] bg-[#F1F1F1]"></div>
      <div className="lg:w-[350px] flex-shrink-0 space-y-4">
        {/* Organization Information Card */}
        <Card className="p-3 md:p-4">
          <div className="flex flex-col items-center gap-3 mb-4 text-center">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src={opportunity.organization_profile.profile_img || "/avatar.svg"}
                alt={opportunity.organization_profile.title}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base">
                {opportunity.organization_profile.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {opportunity.commitment_type === "workbased"
                  ? "Work based"
                  : "Event based"}{" "}
                Opportunity
              </p>
            </div>
          </div>

          {/* Opportunity Details */}
          <div className="space-y-3 text-center">
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h4>
              <p className="text-sm text-gray-600 break-words">
                {opportunity.location}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Available Spots
              </h4>
              <p className="text-sm text-gray-600">
                {opportunity.number_of_volunteers} spots
              </p>
            </div>

            {opportunity.date?.start_date && (
              <div>
                <h4 className="text-sm font-medium mb-1 flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </h4>
                <p className="text-sm text-gray-600">
                  {new Date(opportunity.date.start_date).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            )}

            {opportunity.time?.start_time && (
              <div>
                <h4 className="text-sm font-medium mb-1 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Start Time
                </h4>
                <p className="text-sm text-gray-600">
                  {formatTimeToAMPM(opportunity.time.start_time)}
                </p>
              </div>
            )}
          </div>

          {/* View Organization Profile Button - Only show for volunteers */}
          {userRole === "volunteer" && (
            <div className="mt-4 pt-4 border-t flex justify-center">
              <Link href={`/volunteer/organizer/${opportunity.organization_profile._id}`}>
                <Button variant="outline" className="w-full md:w-auto">
                  View Organization Profile
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Organization Contact Information Card */}
        <Card className="p-3 md:p-4">
          <h3 className="font-semibold mb-3 text-sm md:text-base text-center">
            Organization Information
          </h3>
          <div className="space-y-3 text-center">
            {opportunity.organization_profile.contact_email && (
              <div className="flex items-center justify-center text-sm">
                <span className="text-xs md:text-sm">
                  {opportunity.organization_profile.contact_email}
                </span>
              </div>
            )}

            {opportunity.organization_profile.phone_number && (
              <div className="flex items-center justify-center text-sm">
                <span className="text-xs md:text-sm">
                  {opportunity.organization_profile.phone_number}
                </span>
              </div>
            )}

            {opportunity.organization_profile.website && (
              <div className="flex items-center justify-center text-sm">
                <a
                  href={opportunity.organization_profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs md:text-sm"
                >
                  {opportunity.organization_profile.website}
                </a>
              </div>
            )}

            {opportunity.organization_profile.area && (
              <div className="flex items-start justify-center text-sm">
                <span className="text-xs md:text-sm">
                  {formatText(opportunity.organization_profile.area, opportunity.organization_profile.state)}
                </span>
              </div>
            )}

            {opportunity.organization_profile.bio && (
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600">
                  {opportunity.organization_profile.bio}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Similar Opportunities Card - Only show for volunteers */}
        {userRole === "volunteer" && (
          <Card className="p-3 md:p-4">
            <h3 className="font-semibold mb-3 text-sm md:text-base text-center">
              Similar Opportunities
            </h3>
            <div className="space-y-3">
              {filteredSimilarOpportunities.length > 0 ? (
                filteredSimilarOpportunities.map((similarOpp) => {
                  const opp = similarOpp as unknown as Opportunity;
                  return (
                    <Link
                      key={opp._id}
                      href={`/find-opportunity/opportunity/details/${opp._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative w-8 h-8 flex-shrink-0">
                          <Image
                            src={opp.organization_profile.profile_img || "/avatar.svg"}
                            alt={opp.organization_profile.title}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {opp.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {opp.organization_profile.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {opp.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {opp.number_of_volunteers} spots
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    No similar opportunities found.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 