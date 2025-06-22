"use client";

import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FilterSidebar, { VolunteerFilters } from "./FilterSidebar";
import VolunteerCard from "@/components/layout/organisation/VolunteerCard";
import MessageDialog from "../MessageDialog";
import { SearchBar } from "@/components/navbar/SearchBar";
import { useSearch } from "@/contexts/SearchContext";
import { PaginationWrapper } from "@/components/PaginationWrapper";

interface Volunteer {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
  volunteer_profile?: {
    student_type?: "yes" | "no";
    course?: string;
    availability_date?: {
      start_date?: string;
      end_date?: string;
    };
    interested_on?: string[];
    bio?: string;
  };
}

export default function BrowseVolunteer() {
  const [filters, setFilters] = useState<VolunteerFilters>({
    categories: [],
    studentType: "all",
    availability: {
      startDate: null,
      endDate: null,
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const { searchQuery } = useSearch();

   useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const { data: volunteersData, isLoading } = trpc.users.getAvailableUsers.useQuery({
    page: currentPage,
    limit: 6,
    search: searchQuery || undefined,
    categories: filters.categories.length > 0 ? filters.categories : undefined,
    studentType: filters.studentType,
    availability: filters.availability.startDate && filters.availability.endDate ? {
      startDate: filters.availability.startDate,
      endDate: filters.availability.endDate,
    } : undefined,
  });

  const handleConnect = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsMessageDialogOpen(true);
  };

  const volunteers = volunteersData?.users || [];
  const totalItems = volunteersData?.total || 0;
  const totalPages = volunteersData?.totalPages || 0;
  const startIndex = (currentPage - 1) * 6;
  const endIndex = Math.min(startIndex + 6, totalItems);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="hidden md:block sticky top-4">
          <FilterSidebar onFilterChange={setFilters} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-6 w-full">
            <SearchBar role="organization" disableOverlay />
          </div>

          {!isLoading &&
            volunteers.length > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalItems}{" "}
                volunteers
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[620px]">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="w-full max-w-[382px]">
                  <div className="hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden w-full py-0 cursor-pointer relative bg-white">
                    <div className="p-4">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <div className="flex items-center gap-3 mb-3">
                          <Skeleton className="h-4 w-24" />
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex gap-2 mb-4">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex gap-2 mt-auto">
                          <Skeleton className="h-9 flex-1" />
                          <Skeleton className="h-9 flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : volunteers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No volunteers found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              volunteers.map((volunteer: Record<string, unknown>) => (
                <div key={volunteer._id as string} className="w-full max-w-[382px]">
                  <VolunteerCard
                    volunteer={volunteer as unknown as Volunteer}
                    onConnect={handleConnect}
                  />
                </div>
              ))
            )}
          </div>

          {!isLoading &&
            volunteers.length > 0 && (
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
      </div>

      <MessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        volunteer={selectedVolunteer}
      />
    </div>
  );
}
