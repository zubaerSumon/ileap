"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { Opportunity } from "@/types/opportunities";
import {
  BookOpen,
  FileText,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { getGreeting } from "@/utils/helpers/getGreeting";
import MobileTabsSlider from "@/components/shared/MobileTabsSlider";
import OpportunityCarousel from "./OpportunityCarousel";
import EmptyState from "@/components/shared/EmptyState";
import TabwiseOpportunityCard from "./TabwiseOpportunityCard";

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

const TABS = [
  { key: "applied", label: "Active opportunities" },
  { key: "recent", label: "Recent opportunities" },
  { key: "mentor", label: "Mentor assignments" },
];

export default function VolunteerDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tab, setTab] = useState("applied");

  // Fetch current user's applications
  const { data: applications, isLoading: isLoadingApplications } =
    trpc.applications.getCurrentUserApplications.useQuery();

  // Fetch mentor opportunities
  const { data: mentorOpportunitiesData } =
    trpc.opportunities.getMentorOpportunities.useQuery({
      page: 1,
      limit: 10,
    });

  // Fetch recent opportunities for the carousel
  const {
    data: recentOpportunitiesData,
    isLoading: isLoadingRecentOpportunities,
  } = trpc.opportunities.getAllOpportunities.useQuery({
    page: 1,
    limit: 10,
  });

  const applicationsList = (applications || []) as unknown as Application[];
  const mentorOpportunities = (mentorOpportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];
  const recentOpportunities = (recentOpportunitiesData?.opportunities ||
    []) as unknown as Opportunity[];

  // Filter applications by status and start date
  const now = new Date();
  
  const appliedApplications = applicationsList.filter((app) => {
    if (!app.opportunity) return false;
    
    // For applied: show all applications where opportunity is current or upcoming
    if (app.opportunity.date?.start_date) {
      const startDate = new Date(app.opportunity.date.start_date);
      return startDate >= now; // Current or future start date
    }
    
    // If no start date, include it in applied (assuming it's upcoming)
    return true;
  });
  
  const recentApplications = applicationsList.filter((app) => {
    if (!app.opportunity) return false;
    
    // For recent: show all applications where opportunity has already started (past)
    if (app.opportunity.date?.start_date) {
      const startDate = new Date(app.opportunity.date.start_date);
      return startDate < now; // Past start date only
    }
    
    // If no start date, don't include in recent
    return false;
  });

  // Prepare mobile tabs data
  const mobileTabs = TABS.map((t) => ({
    label: t.label,
    value: t.key,
    count:
      t.key === "applied"
        ? appliedApplications.length
        : t.key === "recent"
        ? recentApplications.length
        : t.key === "mentor"
        ? mentorOpportunities.length
        : 0,
  }));

  // Empty state configurations for each tab
  const emptyStates = {
    applied: {
      icon: BookOpen,
      title: "No active opportunities",
      description:
        "You haven't applied to any current or upcoming opportunities yet. Start exploring and applying to opportunities that interest you.",
      actionLabel: "Explore Opportunities",
      onAction: () => router.push("/search?type=opportunity"),
    },
    recent: {
      icon: FileText,
      title: "No recent opportunities",
      description:
        "You don't have any opportunities that have already started. Your past opportunities will appear here.",
      actionLabel: "Explore Opportunities",
      onAction: () => router.push("/search?type=opportunity"),
    },
    mentor: {
      icon: GraduationCap,
      title: "No mentor assignments",
      description:
        "You haven't been assigned as a mentor for any opportunities yet. Organizations will assign you when they need mentorship support.",
      actionLabel: "Explore Opportunities",
      onAction: () => router.push("/search?type=opportunity"),
    },
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
          onTabChange={setTab}
          className="md:hidden"
        />

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {TABS.map((t) => (
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
              {t.label} (
              {t.key === "applied"
                ? appliedApplications.length
                : t.key === "recent"
                ? recentApplications.length
                : t.key === "mentor"
                ? mentorOpportunities.length
                : 0}
              )
            </button>
          ))}
        </div>

        <button
          className="flex cursor-pointer items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors whitespace-nowrap hover:text-blue-800"
          onClick={() => router.push("/search?type=opportunity")}
        >
          Find more opportunities{" "}
          <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {isLoadingApplications ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        ) : (
          <div className="min-h-[400px]">
            {tab === "applied" && (
              <>
                {appliedApplications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {appliedApplications.map((application) => (
                      <TabwiseOpportunityCard
                        key={application._id}
                        item={application}
                        type="application"
                        tabType="active"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    {...emptyStates.applied}
                    variant="card"
                    className="min-h-[400px]"
                  />
                )}
              </>
            )}

            {tab === "recent" && (
              <>
                {recentApplications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentApplications.map((application) => (
                      <TabwiseOpportunityCard
                        key={application._id}
                        item={application}
                        type="application"
                        tabType="recent"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    {...emptyStates.recent}
                    variant="card"
                    className="min-h-[400px]"
                  />
                )}
              </>
            )}

            {tab === "mentor" && (
              <>
                {mentorOpportunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mentorOpportunities.map((opportunity) => (
                      <TabwiseOpportunityCard
                        key={opportunity._id}
                        item={opportunity}
                        type="opportunity"
                        tabType="mentor"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    {...emptyStates.mentor}
                    variant="card"
                    className="min-h-[400px]"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Recent Opportunities Carousel */}
      <OpportunityCarousel
        opportunities={recentOpportunities}
        isLoading={isLoadingRecentOpportunities}
        title="Discover new opportunities"
        viewAllLink="/search?type=opportunity"
      />
    </div>
  );
}
