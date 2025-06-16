"use client";

import { trpc } from "@/utils/trpc";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FilterSidebar, { VolunteerFilters } from "./FilterSidebar";
import VolunteerCard from "@/components/layout/organisation/VolunteerCard";
import MessageDialog from "../MessageDialog";

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

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function OrganizationHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<VolunteerFilters>({
    categories: [],
    studentType: "all",
    availability: {
      startDate: null,
      endDate: null,
    },
  });
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  // Debounce the search query with a 300ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: volunteers, isLoading } = trpc.users.getAvailableUsers.useQuery();

  const handleConnect = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsMessageDialogOpen(true);
  };

  // Filter volunteers based on search query and filters
  const filteredVolunteers = volunteers?.filter((volunteer) => {
    const searchLower = debouncedSearchQuery.toLowerCase();
    
    // Check if name matches
    const nameMatches = volunteer.name.toLowerCase().includes(searchLower);
    
    // Check if any interests match
    const interestsMatch = volunteer.volunteer_profile?.interested_on?.some(
      (interest: string) => interest.toLowerCase().includes(searchLower)
    );

    // Check category filters
    const categoryMatch = filters.categories.length === 0 || 
      filters.categories.some(category => 
        volunteer.volunteer_profile?.interested_on?.includes(category)
      );

    // Check student type filter
    const studentTypeMatch = filters.studentType === "all" || 
      volunteer.volunteer_profile?.student_type === filters.studentType;

    // Check availability filter
    const availabilityMatch = !filters.availability.startDate || !filters.availability.endDate || 
      (volunteer.volunteer_profile?.availability_date?.start_date && 
       volunteer.volunteer_profile?.availability_date?.end_date &&
       new Date(volunteer.volunteer_profile.availability_date.start_date) <= new Date(filters.availability.endDate) &&
       new Date(volunteer.volunteer_profile.availability_date.end_date) >= new Date(filters.availability.startDate));
    
    // Return true if all conditions match
    return (nameMatches || interestsMatch) && categoryMatch && studentTypeMatch && availabilityMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="hidden md:block sticky top-4">
          <FilterSidebar onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search volunteers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Volunteer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
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
            ) : filteredVolunteers?.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No volunteers found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              filteredVolunteers?.map((volunteer: Volunteer) => (
                <div key={volunteer._id} className="w-full max-w-[382px]">
                  <VolunteerCard volunteer={volunteer} onConnect={handleConnect} />
                </div>
              ))
            )}
          </div>
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