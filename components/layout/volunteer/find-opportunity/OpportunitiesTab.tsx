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
 
export default function OpportunitiesTab() {
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
    <div>
      <FilterBar />
      <OpportunitiesHeader
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-8/12">
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
        <AdBanner />
      </div>
    </div>
  );
} 