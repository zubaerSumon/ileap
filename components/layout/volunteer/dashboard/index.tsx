"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { Opportunity } from "@/types/opportunities";
import {
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { getGreeting } from "@/utils/helpers/getGreeting";
import MobileTabsSlider from "@/components/layout/shared/MobileTabsSlider";
import OpportunityCarousel from "./OpportunityCarousel";
import EmptyState from "@/components/layout/shared/EmptyState";
import TabwiseOpportunityCard from "./TabwiseOpportunityCard";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import {  VolunteerDashboardTabKey, VOLUNTEER_DASHBOARD_TABS } from "@/utils/constants/volunteer-dashboard-tabs";

interface Application {
  _id: string;
  status: "pending" | "approved" | "rejected";
  opportunity: {
    _id: string;
    title: string;
    description: string;
    category: string[];
    location: string;
    commitment_type: string;
    organization_profile?: {
      _id: string;
      title: string;
      profile_img?: string;
    };
    createdAt: string;
    date?: {
      start_date?: string;
      end_date?: string;
    };
    time?: {
      start_time?: string;
      end_time?: string;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tab, setTab] = useState<VolunteerDashboardTabKey>("applied");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  // Fetch all tab counts initially
  const { data: activeApplicationsCountData } =
    trpc.applications.getCurrentUserActiveApplicationsCount.useQuery();

  const { data: recentApplicationsCountData } =
    trpc.applications.getCurrentUserRecentApplicationsCount.useQuery();

  const { data: mentorOpportunitiesCountData } =
    trpc.opportunities.getMentorOpportunitiesCount.useQuery();

  const { data: favoriteOpportunitiesCountData } =
    trpc.volunteers.getFavoriteOpportunitiesCount.useQuery();

  // Fetch active applications with server-side filtering and pagination
  const { data: activeApplicationsData, isLoading: isLoadingActiveApplications } =
    trpc.applications.getCurrentUserActiveApplications.useQuery({
      page: currentPage,
      limit: 6,
    }, {
      enabled: tab === "applied",
    });

  // Fetch recent applications with server-side filtering and pagination
  const { data: recentApplicationsData, isLoading: isLoadingRecentApplications } =
    trpc.applications.getCurrentUserRecentApplications.useQuery({
      page: currentPage,
      limit: 6,
    }, {
      enabled: tab === "recent",
    });

  // Fetch mentor opportunities with pagination
  const { data: mentorOpportunitiesData, isLoading: isLoadingMentorOpportunities } =
    trpc.opportunities.getMentorOpportunities.useQuery({
      page: currentPage,
      limit: 6,
    }, {
      enabled: tab === "mentor",
    });

  // Fetch favorite opportunities with pagination
  const { data: favoriteOpportunitiesData, isLoading: isLoadingFavoriteOpportunities } =
    trpc.volunteers.getFavoriteOpportunitiesWithPagination.useQuery({
      page: currentPage,
      limit: 6,
    }, {
      enabled: tab === "favorites",
    });

  // Fetch recent opportunities for the carousel
  const {
    data: recentOpportunitiesData,
    isLoading: isLoadingRecentOpportunities,
  } = trpc.opportunities.getAllOpportunities.useQuery({
    page: 1,
    limit: 10,
  });

  const activeApplications = (activeApplicationsData?.applications || []) as unknown as Application[];
  const recentApplications = (recentApplicationsData?.applications || []) as unknown as Application[];
  const mentorOpportunities = (mentorOpportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];
  const favoriteOpportunities = (favoriteOpportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];
  const recentOpportunities = (recentOpportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];

  // Dynamic tab data mapping with counts from dedicated count queries
  const tabData = {
    applied: {
      items: activeApplications,
      type: "application" as const,
      tabType: "active" as const,
      total: activeApplicationsCountData?.total || 0,
      totalPages: activeApplicationsData?.totalPages || 0,
      isLoading: isLoadingActiveApplications,
    },
    recent: {
      items: recentApplications,
      type: "application" as const,
      tabType: "recent" as const,
      total: recentApplicationsCountData?.total || 0,
      totalPages: recentApplicationsData?.totalPages || 0,
      isLoading: isLoadingRecentApplications,
    },
    mentor: {
      items: mentorOpportunities,
      type: "opportunity" as const,
      tabType: "mentor" as const,
      total: mentorOpportunitiesCountData?.total || 0,
      totalPages: mentorOpportunitiesData?.totalPages || 0,
      isLoading: isLoadingMentorOpportunities,
    },
    favorites: {
      items: favoriteOpportunities,
      type: "opportunity" as const,
      tabType: "favorites" as const,
      total: favoriteOpportunitiesCountData?.total || 0,
      totalPages: favoriteOpportunitiesData?.totalPages || 0,
      isLoading: isLoadingFavoriteOpportunities,
    },
  };

  // Prepare mobile tabs data - filter out mentor tab if count is 0
  const mobileTabs = VOLUNTEER_DASHBOARD_TABS.map((t) => ({
    label: t.label,
    value: t.key,
    count: tabData[t.key as keyof typeof tabData].total,
  })).filter((t) => {
    // Hide mentor tab if count is 0
    if (t.value === "mentor") {
      return tabData.mentor.total > 0;
    }
    return true;
  });

  // Get current tab data
  const currentTabData = tabData[tab as keyof typeof tabData];
  const currentTabConfig = VOLUNTEER_DASHBOARD_TABS.find(t => t.key === tab);

  // Handle tab switching if current tab becomes unavailable
  useEffect(() => {
    if (tab === "mentor" && tabData.mentor.total === 0) {
      setTab("applied");
    }
  }, [tab, tabData.mentor.total]);

  // Render tab content dynamically
  const renderTabContent = () => {
    const { items, type, tabType, totalPages, isLoading } = currentTabData;
    
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      );
    }
    
    if (items.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <TabwiseOpportunityCard
                key={item._id}
                item={item}
                type={type}
                tabType={tabType}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxVisiblePages={5}
              />
            </div>
          )}
        </>
      );
    }

    return (
      <EmptyState
        icon={currentTabConfig?.icon || BookOpen}
        title={currentTabConfig?.emptyState.title || "No items found"}
        description={currentTabConfig?.emptyState.description || "No items available."}
        actionLabel="Explore Opportunities"
        onAction={() => router.push("/find-opportunity")}
        variant="card"
        className="min-h-[400px]"
      />
    );
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-6 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-bold tracking-tight">
          {getGreeting()}, {session?.user?.name || "Volunteer"}
        </h2>
      </div>

      {/* Overview Section */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Overview</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        {/* Mobile Tabs Slider */}
        <MobileTabsSlider
          tabs={mobileTabs}
          activeTab={tab}
          onTabChange={(value) => setTab(value as VolunteerDashboardTabKey)}
          className="md:hidden"
        />

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {VOLUNTEER_DASHBOARD_TABS.map((t) => {
            // Hide mentor tab if count is 0
            if (t.key === "mentor" && tabData.mentor.total === 0) {
              return null;
            }
            
            return (
              <button
                key={t.key}
                className={`px-4 md:px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap shadow-sm hover:shadow-md
                  ${
                    tab === t.key
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                  }
                `}
                onClick={() => setTab(t.key)}
                style={{ minWidth: "auto" }}
              >
                {t.label} ({tabData[t.key as keyof typeof tabData].total})
              </button>
            );
          })}
        </div>

        <button
          className="flex cursor-pointer items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors whitespace-nowrap hover:text-blue-800"
          onClick={() => router.push("/find-opportunity")}
        >
          Find more opportunities{" "}
          <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>

      {/* Recent Opportunities Carousel */}
      <OpportunityCarousel
        opportunities={recentOpportunities}
        isLoading={isLoadingRecentOpportunities}
        title="Discover new opportunities"
        viewAllLink="/find-opportunity"
      />
    </div>
  );
}
