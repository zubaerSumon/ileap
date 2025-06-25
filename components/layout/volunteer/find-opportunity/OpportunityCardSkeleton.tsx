"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function OpportunityCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden w-full py-0 cursor-pointer relative bg-white">
      <CardContent className="p-4 flex flex-col">
        <div className="flex flex-col">
          {/* Title and Favorite Button Row */}
          <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <Skeleton className="h-5 w-3/4 flex-1 pr-2" />
            <div className="flex items-center gap-2 flex-shrink-0">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
          
          {/* Posted by section */}
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          {/* Location and Spots */}
          <div className="space-y-1.5 mb-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex gap-1.5 mb-3 flex-shrink-0">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-18 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          
          {/* Description */}
          <div className="mb-4 flex-shrink-0">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Footer */}
          <div className="mt-auto flex-shrink-0">
            {/* Date, Time and Type - Always on same line */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 w-[100px] rounded-lg" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 