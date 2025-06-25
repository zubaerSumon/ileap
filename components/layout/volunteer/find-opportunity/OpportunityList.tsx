"use client";

import { Card } from "@/components/ui/card";
import OpportunityCard from "./OpportunityCard";
import OpportunityCardSkeleton from "./OpportunityCardSkeleton";
import { Opportunity } from "@/types/opportunities";

interface OpportunityListProps {
  opportunities: Opportunity[];
  isLoading: boolean;
}

export default function OpportunityList({
  opportunities,
  isLoading,
}: OpportunityListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <OpportunityCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <Card className="p-20 shadow-sm border border-gray-200 rounded-xl">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No opportunities found.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity._id}
          opportunity={opportunity}
        />
      ))}
    </div>
  );
}
