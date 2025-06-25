"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { useSearch } from "@/contexts/SearchContext";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import FilterSidebar from "./FilterSidebar";
import OpportunitiesHeader from "./OpportunitiesHeader";
import OpportunityList from "./OpportunityList";
import { Opportunity } from "@/types/opportunities";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function FindOpportunity() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { filters, clearAllFilters } = useSearch();

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchQuery, filters.categories, filters.commitmentType, filters.location, filters.availability]);

  const { data: opportunitiesData, isLoading } =
    trpc.opportunities.getAllOpportunities.useQuery({
      page: currentPage,
      limit: 10,
      search: filters.searchQuery || undefined,
      categories: filters.categories.length > 0 ? filters.categories : undefined,
      commitmentType: filters.commitmentType,
      location: filters.location || undefined,
      availability: filters.availability || undefined,
    });

  // Debug logging
  console.log("Current filters:", filters);
  console.log("Query result:", opportunitiesData);

  const opportunities = (opportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];
  const totalItems = opportunitiesData?.total || 0;
  const totalPages = opportunitiesData?.totalPages || 0;

  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, totalItems);

  // Count active filters for mobile display
  const activeFiltersCount = filters.categories.length + 
    (filters.commitmentType !== "all" ? 1 : 0) + 
    (filters.location ? 1 : 0) + 
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Volunteer Opportunity
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover meaningful ways to give back to your community and make a
            difference in the world.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block sticky top-4">
            <FilterSidebar />
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
                  onClick={() => clearAllFilters()}
                  className="px-4"
                >
                  Reset
                </Button>
              </div>
            </div>

            <OpportunitiesHeader
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
            />

            <div className="w-full">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600 shadow-sm">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading opportunities...
                  </div>
                </div>
              ) : totalItems > 0 ? (
                <>
                  <OpportunityList
                    opportunities={opportunities}
                    isLoading={isLoading}
                  />
                  <div className="mt-8 flex justify-center">
                    <PaginationWrapper
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      maxVisiblePages={5}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your filters or search terms to find more opportunities.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => clearAllFilters()}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Modal */}
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogContent 
              className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto" 
            >
              <DialogHeader>
                <DialogTitle>Filter Opportunities</DialogTitle>
              </DialogHeader>
              <div className="p-2">
                <FilterSidebar />
              </div>
              <div className="px-4 pb-2 flex justify-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-6"
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
