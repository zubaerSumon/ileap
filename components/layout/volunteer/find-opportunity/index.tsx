"use client";

import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteButton } from "@/components/buttons/FavoriteButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Binoculars } from "lucide-react";

import { useSearch } from "@/contexts/SearchContext";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  category: string[];
  location: string;
  commitment_type: "workbased" | "eventbased";
  number_of_volunteers: number;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  updatedAt: string;
  recurrence?: {
    date_range?: {
      start_date: string;
      end_date?: string;
    };
  };
  organization_profile?: {
    _id: string;
    title: string;
    profile_img?: string;
  };
  created_by?: {
    _id: string;
    name: string;
  };
  spotsAvailable?: number;
  formattedDates?: {
    start_date: string;
    end_date?: string;
  };
}

export type OpportunityDetails = {
  id: string;
  title: string;
  organization: {
    title: string;
    id: string;
  };
  location: string;
};

export default function FindOpportunity() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const { data: opportunitiesData, isLoading } =
    trpc.opportunities.getAllOpportunities.useQuery({
      page: currentPage,
      limit: 10,
      search: searchQuery || undefined,
    });

  const opportunities = (opportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];
  const totalItems = opportunitiesData?.total || 0;
  const totalPages = opportunitiesData?.totalPages || 0;

  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, totalItems);

  const handleOpportunityClick = (id: string) => {
    router.push(`/volunteer/opportunities/${id}`);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList className="border-b border-gray-200 w-full justify-start rounded-none bg-transparent p-0 -mb-px">
            <TabsTrigger
              value="opportunities"
              className="mr-6 py-3 border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 rounded-none text-base data-[state=active]:font-semibold font-medium text-gray-600 hover:text-orange-400 flex items-center gap-2"
            >
              <Binoculars className="h-5 w-5" /> Find Volunteer Opportunities
            </TabsTrigger>
            <TabsTrigger
              value="organizations"
              className="py-3 border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 rounded-none text-base data-[state=active]:font-semibold font-medium text-gray-600 hover:text-orange-400"
            >
              Organizations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="mt-6">
            <div className="p-4 md:p-6 bg-blue-500 rounded-lg mb-6 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-2 flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="work-based"
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
                    />
                    <label htmlFor="work-based" className="font-medium text-white">
                      Work Based
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="event-based"
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
                    />
                    <label htmlFor="event-based" className="font-medium text-white">
                      Event Based
                    </label>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <Input
                    placeholder="Enter Location"
                    className="bg-white text-gray-800 rounded-md"
                  />
                  <p className="text-xs mt-1 text-blue-200">
                    Location of the opportunity or organization
                  </p>
                </div>

                <div className="lg:col-span-4 flex items-center justify-center gap-2">
                  <Select>
                    <SelectTrigger className="bg-blue-400 border-none w-auto rounded-full text-white">
                      <SelectValue placeholder="Cause Areas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="animals">Animals</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="bg-blue-400 border-none w-auto rounded-full text-white">
                      <SelectValue placeholder="Skills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="bg-blue-400 border-none w-auto rounded-full text-white">
                      <SelectValue placeholder="More Filters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good-for-groups">
                        Good for Groups
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-3 flex flex-col items-stretch gap-2">
                  <div className="w-full relative">
                    <Input
                      placeholder="Search by Keyword"
                      className="bg-blue-50 text-gray-800 placeholder:text-gray-500 rounded-full pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>
                  <Button
                    variant="link"
                    className="text-white hover:text-blue-300 p-0 h-auto justify-end text-xs"
                  >
                    CLEAR ALL FILTERS
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-8/12">
                <div className="mb-4">
                  <h2 className="text-xl font-light text-gray-600">
                    The Best Volunteer Opportunities in Dhaka | VolunteerMatch
                  </h2>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500 border-b pb-4">
                    <p>
                      {totalItems > 0
                        ? `Displaying ${
                            startIndex + 1
                          } - ${endIndex} of ${totalItems} Opportunities`
                        : "No opportunities found"}
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

                <OpportunityList
                  opportunities={opportunities}
                  isLoading={isLoading}
                  onOpportunityClick={handleOpportunityClick}
                />

                {!isLoading && totalItems > 0 && (
                  <div className="mt-8 flex justify-center">
                    <PaginationWrapper
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      maxVisiblePages={5}
                    />
                  </div>
                )}
              </div>
              <div className="w-full lg:w-4/12">
                <div className="sticky top-24">
                  <div className="p-1 border bg-white rounded-lg">
                    <Image
                      src="/images/banners/ad-banner-browse-opportunities.png"
                      alt="Make a greater impact on the inside"
                      width={400}
                      height={600}
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="organizations">
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Organization search will be implemented here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const OpportunityList = ({
  opportunities,
  isLoading,
  onOpportunityClick,
}: {
  opportunities: Opportunity[];
  isLoading: boolean;
  onOpportunityClick: (id: string) => void;
}) => {
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
};
