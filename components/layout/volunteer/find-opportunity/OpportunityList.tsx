"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteButton } from "@/components/buttons/FavoriteButton";
import { format } from "date-fns";
import { Opportunity } from "@/types/opportunities";
 
interface OpportunityListProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  onOpportunityClick: (id: string) => void;
}

export default function OpportunityList({
  opportunities,
  isLoading,
  onOpportunityClick,
}: OpportunityListProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="py-6">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-5 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No opportunities found.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {opportunities.map((opportunity) => (
        <div key={opportunity._id} className="py-6 relative group">
          <div className="absolute top-6 right-0">
            <FavoriteButton opportunityId={opportunity._id} />
          </div>
          <div className="pr-10">
            <h3
              className="text-2xl font-medium text-gray-800 hover:text-blue-600 cursor-pointer"
              onClick={() => onOpportunityClick(opportunity._id)}
            >
              {opportunity.title}
            </h3>
            <p className="text-md text-blue-600 font-medium mt-1 hover:underline cursor-pointer">
              Organization: {opportunity.organization_profile?.title}
            </p>
            <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
              <span>Flexible Schedule</span>
              <span className="text-gray-300">|</span>
              <span>Virtual Opportunity</span>
            </div>
            <div
              className="mt-4 text-sm text-gray-700 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: opportunity.description }}
            ></div>
            <p className="mt-4 text-sm text-gray-400">
              Date Posted:{" "}
              {format(new Date(opportunity.updatedAt), "MMMM d, yyyy")}
            </p>
            <button className="mt-4 text-sm text-blue-600 hover:underline font-semibold">
              View 3 More Opportunities From This Org
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 