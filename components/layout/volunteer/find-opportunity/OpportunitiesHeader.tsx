"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OpportunitiesHeaderProps {
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export default function OpportunitiesHeader({
  totalItems,
  startIndex,
  endIndex,
}: OpportunitiesHeaderProps) {
  return (
    <div className="w-full lg:w-8/12 pr-6">
      <h2 className="text-xl font-light text-gray-600">
        The Best Volunteer Opportunities in Dhaka | VolunteerMatch
      </h2>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500 border-b pb-4">
        <p>
          {totalItems > 0
            ? `Displaying ${startIndex + 1} - ${endIndex} of ${totalItems} Opportunities`
            : totalItems === 0
              ? "No opportunities found"
              : ""
          }
        </p>
        <Select defaultValue="new">
          <SelectTrigger className="w-auto focus:ring-0 border-0 shadow-none text-red-500 font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Near Me & New</SelectItem>
            <SelectItem value="relevant">Most Relevant</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 