"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useSearch } from "@/contexts/SearchContext";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import FilterSidebar from "@/components/layout/volunteer/find-opportunity/FilterSidebar";
import FilterDialog from "@/components/layout/volunteer/find-opportunity/FilterDialog";
import OpportunitiesHeader from "@/components/layout/volunteer/find-opportunity/OpportunitiesHeader";
import OpportunityList from "@/components/layout/volunteer/find-opportunity/OpportunityList";
import { Opportunity } from "@/types/opportunities";
import { Button } from "@/components/ui/button";
import { Filter, Search, Users, Briefcase } from "lucide-react";
 
export default function VolunteerDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { filters, clearAllFilters } = useSearch();

  // Get current tab from URL or default to "all"
  const currentTab = searchParams.get("tab") || "all";

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.searchQuery,
    filters.categories,
    filters.commitmentType,
    filters.location,
    filters.availability,
    currentTab,
  ]);

  // Use different query based on tab
  const { data: opportunitiesData, isLoading } =
    currentTab === "mentor"
      ? trpc.opportunities.getMentorOpportunities.useQuery({
          page: currentPage,
          limit: 6,
          search: filters.searchQuery || undefined,
          categories:
            filters.categories.length > 0 ? filters.categories : undefined,
          commitmentType: filters.commitmentType,
          location: filters.location || undefined,
          availability: filters.availability?.startDate || undefined,
        })
      : trpc.opportunities.getAllOpportunities.useQuery({
          page: currentPage,
          limit: 6,
          search: filters.searchQuery || undefined,
          categories:
            filters.categories.length > 0 ? filters.categories : undefined,
          commitmentType: filters.commitmentType,
          location: filters.location || undefined,
          availability: filters.availability || undefined,
        });

  // Debug logging
  console.log("Current filters:", filters);
  console.log("Current tab:", currentTab);
  console.log("Query result:", opportunitiesData);

  const opportunities = (opportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];
  const totalItems = opportunitiesData?.total || 0;
  const totalPages = opportunitiesData?.totalPages || 0;

  const startIndex = (currentPage - 1) * 6;
  const endIndex = Math.min(startIndex + 6, totalItems);

  // Count active filters for mobile display
  const activeFiltersCount =
    filters.categories.length +
    (filters.commitmentType !== "all" ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.push(`/volunteer/dashboard?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Volunteer Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your volunteer opportunities and mentor assignments in one
            place.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              All Opportunities
            </button>
            <button
              onClick={() => handleTabChange("mentor")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === "mentor"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4" />
              Mentor Opportunities
            </button>
          </div>
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
                  className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => clearAllFilters()}
                  className="px-4 shadow-sm hover:shadow-md transition-all duration-200"
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
              <OpportunityList
                opportunities={opportunities}
                isLoading={isLoading}
              />

              {totalItems > 0 ? (
                <div className="mt-8 flex justify-center">
                  <PaginationWrapper
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    maxVisiblePages={5}
                  />
                </div>
              ) : !isLoading ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <Search className="mx-auto h-12 w-12" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {currentTab === "mentor"
                        ? "No mentor opportunities found"
                        : "No opportunities found"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {currentTab === "mentor"
                        ? "You haven't been assigned as a mentor for any opportunities yet. Organizations will assign you as a mentor when they need your guidance."
                        : "Try adjusting your filters or search terms to find more opportunities."}
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
              ) : null}
            </div>
          </div>

          <FilterDialog
            isOpen={isFilterModalOpen}
            onOpenChange={setIsFilterModalOpen}
            activeFiltersCount={activeFiltersCount}
            onClearAllFilters={clearAllFilters}
          />
        </div>
      </div>
    </div>
  );
}
