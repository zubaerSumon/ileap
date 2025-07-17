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
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/layout/shared/EmptyState";
import { Users } from "lucide-react";

interface Volunteer {
  _id: string;
  name: string;
  image?: string;
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

export default function FindVolunteer() {
  const [filters, setFilters] = useState<VolunteerFilters>({
    categories: [],
    studentType: "all",
    memberType: "all",
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { searchQuery } = useSearch();

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const { data: volunteersData, isLoading } =
    trpc.users.getAvailableUsers.useQuery({
      page: currentPage,
      limit: 6,
      search: searchQuery || undefined,
      categories:
        filters.categories.length > 0 ? filters.categories : undefined,
      studentType: filters.studentType,
      availability:
        filters.availability.startDate && filters.availability.endDate
          ? {
              startDate: filters.availability.startDate,
              endDate: filters.availability.endDate,
            }
          : undefined,
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

  // Count active filters for mobile display
  const activeFiltersCount =
    filters.categories.length + (filters.studentType !== "all" ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Volunteer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with passionate volunteers who are ready to help your organization make a difference in the community.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block sticky top-4">
          <FilterSidebar onFilterChange={setFilters} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4 flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    categories: [],
                    studentType: "all",
                    memberType: "all",
                    availability: {
                      startDate: null,
                      endDate: null,
                    },
                  });
                }}
                className="px-4"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="mb-6 w-full">
            <SearchBar role="organization" disableOverlay />
          </div>

          {!isLoading && volunteers.length > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {startIndex + 1} to {endIndex} of {totalItems} volunteers
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
              <EmptyState
                icon={Users}
                title="No volunteers found"
                description="Try adjusting your search criteria to find more volunteers that match your requirements."
                variant="default"
                showAction={false}
              />
            ) : (
              volunteers.map((volunteer: Record<string, unknown>) => (
                <div
                  key={volunteer._id as string}
                  className="w-full max-w-[382px]"
                >
                  <VolunteerCard
                    volunteer={volunteer as unknown as Volunteer}
                    onConnect={handleConnect}
                  />
                </div>
              ))
            )}
          </div>

          {!isLoading && volunteers.length > 0 && (
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

      {/* Mobile Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent
          className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto [&>button]:hidden"
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Filter Volunteers</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            <FilterSidebar
              onFilterChange={setFilters}
              currentFilters={filters}
            />
          </div>
          <div className="px-4 pb-2 flex justify-center">
            <Button
              onClick={() => setIsFilterModalOpen(false)}
              className="px-6"
            >
              Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        volunteer={selectedVolunteer}
      />
    </div>
  );
}
