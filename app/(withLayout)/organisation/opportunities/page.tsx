"use client";

import React from "react";
import { useState } from "react";
import { CreateOpportunityButton } from "@/components/buttons/CreateOpportunityButton";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

import { Calendar, Users, UserCheck } from "lucide-react";
import { trpc } from "@/utils/trpc";
import type { Opportunity } from "@/types/opportunities";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import OpportunityTabs from "@/components/layout/organisation/opportunities/OpportunityTabs";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { usePagination } from "@/hooks/usePagination";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";
import OpportunityActionsDropdown from "@/components/layout/organisation/opportunities/OpportunityActionsDropdown";
import Loading from "@/app/loading";
import OrganizationAvatar from "@/components/ui/OrganizationAvatar";

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("open");

  const { data: opportunities, isLoading } =
    trpc.opportunities.getOrganizationOpportunities.useQuery();

  // Filter opportunities based on active tab
  const filteredOpportunities = React.useMemo(() => {
    if (!opportunities) return [];

    switch (activeTab) {
      case "open":
        return opportunities.filter((opp) => !opp.is_archived);
      case "draft":
        // Show recently created opportunities (within last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return opportunities.filter(
          (opp) => !opp.is_archived && new Date(opp.createdAt) >= sevenDaysAgo
        );
      case "recruited":
        return opportunities.filter(
          (opp) => !opp.is_archived && opp.recruitCount && opp.recruitCount > 0
        );
      case "archived":
        return opportunities.filter((opp) => opp.is_archived);
      default:
        return opportunities.filter((opp) => !opp.is_archived);
    }
  }, [opportunities, activeTab]);

  // Use the pagination hook with filtered data
  const { currentPage, totalPages, paginatedData, setCurrentPage } =
    usePagination(filteredOpportunities, {
      pageSize: 4,
      initialPage: 1,
    });

  // Get counts for each tab
  const tabCounts = React.useMemo(() => {
    if (!opportunities) return { open: 0, draft: 0, recruited: 0, archived: 0 };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return {
      open: opportunities.filter((opp) => !opp.is_archived).length,
      draft: opportunities.filter(
        (opp) => !opp.is_archived && new Date(opp.createdAt) >= sevenDaysAgo
      ).length,
      recruited: opportunities.filter(
        (opp) => !opp.is_archived && opp.recruitCount && opp.recruitCount > 0
      ).length,
      archived: opportunities.filter((opp) => opp.is_archived).length,
    };
  }, [opportunities]);

  const columnHelper = createColumnHelper<Opportunity>();

  const columns = [
    columnHelper.display({
      id: "role",
      header: () => <span>Role name</span>,
      cell: (info) => {
        const org = info.row.original.organization_profile;
        return (
          <div className="flex items-center gap-3 min-h-[64px]">
            <OrganizationAvatar
              organization={{
                title: org?.title || "Organization",
                profile_img: org?.profile_img
              }}
              size={32}
              className="size-8"
            />
            <div>
              <div className="font-medium text-[15px]">
                {info.row.original.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-[#246BFD]">
                  {org?.title || "Organization"}
                </span>
                <span className="text-gray-400">•</span>
                <span>
                  Posted –{" "}
                  {new Date(info.row.original.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "startDateTime",
      header: () => <span>Start Date & Time</span>,
      cell: (info) => {
        const opportunity = info.row.original;
        if (!opportunity.date?.start_date) {
          return (
            <div className="w-full text-center text-gray-400">Not set</div>
          );
        }

        const startDate = new Date(opportunity.date.start_date);
        const formattedDate = startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div className="w-full text-center">
            <div className="text-sm font-medium">{formattedDate}</div>
            <div className="text-xs text-gray-500">
              {opportunity.time?.start_time
                ? formatTimeToAMPM(opportunity.time.start_time)
                : "Time TBD"}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("applicantCount", {
      header: "Applicants",
      cell: (info) => (
        <div className="w-full text-center">{info.getValue() || 0}</div>
      ),
    }),
    columnHelper.accessor("recruitCount", {
      header: "Recruits",
      cell: (info) => (
        <div className="w-full text-center">{info.getValue() || 0}</div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <div className="w-[60px] text-center">
          <OpportunityActionsDropdown
            opportunityId={info.row.original._id}
            activeTab={activeTab}
            className="ml-auto"
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: { pagination: { pageIndex: currentPage - 1, pageSize: 4 } },
  });

  // Mobile card component for opportunities
  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const org = opportunity.organization_profile;
    const startDate = opportunity.date?.start_date
      ? new Date(opportunity.date.start_date)
      : null;
    const formattedDate = startDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <OrganizationAvatar
              organization={{
                title: org?.title || "Organization",
                profile_img: org?.profile_img
              }}
              size={40}
              className="size-10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 break-words leading-tight mb-1">
                {opportunity.title}
              </h3>
              <p className="text-sm text-[#246BFD] font-medium truncate">
                {org?.title || "Organization"}
              </p>
            </div>
          </div>
          <OpportunityActionsDropdown
            opportunityId={opportunity._id}
            activeTab={activeTab}
            size="sm"
            className="shrink-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Start Date</p>
              <p className="font-medium text-sm">
                {formattedDate || "Not set"}
              </p>
              {opportunity.time?.start_time && (
                <p className="text-xs text-gray-400">
                  {formatTimeToAMPM(opportunity.time.start_time)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Applicants</p>
              <p className="font-medium text-sm">
                {opportunity.applicantCount || 0}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <UserCheck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Recruits</p>
              <p className="font-medium text-sm">
                {opportunity.recruitCount || 0}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-4 h-4 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Posted</p>
              <p className="font-medium text-sm">
                {new Date(opportunity.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedLayout>
      <div className="  min-h-screen">
        <div className="max-w-7xl py-4 sm:py-8 px-4 mx-auto">
          <div className="bg-white rounded-lg flex flex-col min-h-[600px]">
            <div className="px-4 pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold mb-1">
                    Opportunities
                  </h1>
                  <p className="text-sm text-gray-500">Posted tasks</p>
                </div>
                <CreateOpportunityButton />
              </div>
              <OpportunityTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                openCount={tabCounts.open}
                draftCount={tabCounts.draft}
                recruitedCount={tabCounts.recruited}
                archivedCount={tabCounts.archived}
              />
            </div>

            <div className="flex-1 flex flex-col">
              {/* Desktop Table View */}
              <div className="hidden md:block px-4 flex-1 min-h-[400px]">
                <div className="flex items-center py-3 px-6 bg-gray-50 text-sm text-gray-500 rounded-md">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <React.Fragment key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <div
                          key={header.id}
                          className={
                            header.id === "role"
                              ? "flex-1"
                              : header.id === "startDateTime"
                              ? "w-[140px] text-center"
                              : header.id === "actions"
                              ? "w-[60px] text-center"
                              : "w-[120px] text-center"
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-10 text-gray-500 min-h-[300px]">
                    Loading...
                  </div>
                ) : paginatedData.length === 0 ? (
                  <div className="flex justify-center items-center py-10 text-gray-500 min-h-[300px]">
                    No opportunities found.
                  </div>
                ) : (
                  <div className="min-h-[300px]">
                    {table.getRowModel().rows.map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center py-4 px-6 border-b last:border-b-0 hover:bg-gray-50 min-h-[64px]"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <div
                            key={cell.id}
                            className={
                              cell.column.id === "role"
                                ? "flex-1"
                                : cell.column.id === "startDateTime"
                                ? "w-[140px] text-center"
                                : cell.column.id === "actions"
                                ? "w-[60px] text-center"
                                : "w-[120px] text-center"
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden px-4 flex-1 min-h-[400px]">
                {isLoading ? (
                  <Loading size="medium">
                    <p className="text-gray-600 mt-2">Wait a sec...</p>
                  </Loading>
                ) : paginatedData.length === 0 ? (
                  <div className="flex justify-center items-center py-10 text-gray-500 min-h-[300px]">
                    No opportunities found.
                  </div>
                ) : (
                  <div className="space-y-4 min-h-[300px]">
                    {paginatedData.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity._id}
                        opportunity={opportunity}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 flex items-center justify-center border-t bg-gray-50">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxVisiblePages={5}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
