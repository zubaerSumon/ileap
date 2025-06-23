"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useSearch } from "@/contexts/SearchContext";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import FilterBar from "./FilterBar";
import OpportunitiesHeader from "./OpportunitiesHeader";
import OpportunityList from "./OpportunityList";
import AdBanner from "./AdBanner";
import { Opportunity } from "@/types/opportunities";
import { Button } from "@/components/ui/button";

export default function OpportunitiesTab() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleOpportunityClick = (id: string) => {
    router.push(`/volunteer/opportunities/${id}`);
  };

  return (
    <div>
      <FilterBar />
      <OpportunitiesHeader
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-8/12">
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : totalItems > 0 ? (
            <>
              <OpportunityList
                opportunities={opportunities}
                isLoading={isLoading}
                onOpportunityClick={handleOpportunityClick}
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
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No opportunities found</div>
              <div className="text-gray-400 text-sm mb-4">
                Try adjusting your filters or search terms
              </div>
              <Button
                variant="outline"
                onClick={() => clearAllFilters()}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
        <AdBanner />
      </div>
    </div>
  );
} 