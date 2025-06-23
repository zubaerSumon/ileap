"use client";

import { FavoriteButton } from "@/components/buttons/FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { Opportunity } from "@/types/opportunities";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onOpportunityClick: (id: string) => void;
}

export default function OpportunityCard({
  opportunity,
  onOpportunityClick,
}: OpportunityCardProps) {
  return (
    <Card
      className="relative group shadow-none gap-0 rounded-none border-0 border-b group-last:border-b-0 border-gray-200 py-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={() => onOpportunityClick(opportunity._id)}
    >
      <CardContent className="p-4 md:p-6">
        <div className="absolute top-4 md:top-6 right-4 md:right-6">
          <FavoriteButton opportunityId={opportunity._id} />
        </div>

        <div className="pr-8 md:pr-12 space-y-3">
          <div className="">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 hover:text-blue-600 line-clamp-1">
              {opportunity.title}
            </h3>
            <p
              onClick={(e) => e.stopPropagation()}
              className="text-sm mt-1"
            >
              Posted by:{" "}
              <Link
                href={`/volunteer/organizer/${opportunity.organization_profile?._id}`}
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                {opportunity.organization_profile?.title}
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-blue-500" />
              <span>{opportunity.location}</span>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {opportunity.commitment_type === "workbased"
                ? "Work-based"
                : "Event-based"}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-green-500" />
              <span>
                <span className="font-medium text-green-600">
                  {opportunity.number_of_volunteers -
                    (opportunity.recruitCount || 0)}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {opportunity.number_of_volunteers}
                </span>{" "}
                spots left
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {opportunity.category.map((category, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs font-normal bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {category}
              </Badge>
            ))}
          </div>

          <div
            className="text-sm text-gray-700 line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{ __html: opportunity.description }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
            {opportunity.start_date && (
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>
                  {format(new Date(opportunity.start_date), "MMM d, yyyy")}
                </span>
              </div>
            )}
            {opportunity.start_time && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{opportunity.start_time}</span>
              </div>
            )}
            <span>
              Posted:{" "}
              {format(new Date(opportunity.updatedAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter onClick={(e) => e.stopPropagation()} className="pb-4 md:pb-6 px-4 md:px-6 flex justify-center">
        <Link href={`#`} className="text-sm text-blue-600 hover:underline hover:text-blue-800">
          View 3 More Opportunities From This Org
        </Link>
      </CardFooter>
    </Card>
  );
} 