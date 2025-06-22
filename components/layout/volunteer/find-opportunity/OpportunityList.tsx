"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import OpportunityCard from "./OpportunityCard";
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
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            className="p-6 shadow-none border-0 border-b border-gray-200"
          >
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-3" />
            <div className="flex space-x-2 mb-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-1/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <Card className="p-20 shadow-none border-0 border-b border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No opportunities found.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-0">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity._id}
          opportunity={opportunity}
          onOpportunityClick={onOpportunityClick}
        />
      ))}
    </div>
  );
}
