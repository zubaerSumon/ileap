"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import OpportunityCard from "./OpportunityCard";
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
          <div key={index} className="w-full">
            <Card className="hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden w-full py-0 cursor-pointer relative bg-white h-full">
              <div className="p-4 h-full">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  
                  {/* Title */}
                  <Skeleton className="h-6 w-32 mb-3" />
                  
                  {/* Location and Spots */}
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-4 w-20" />
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  
                  {/* Categories */}
                  <div className="flex gap-1 mb-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  
                  {/* Description */}
                  <div className="flex-1 mb-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-9 w-full rounded" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
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
