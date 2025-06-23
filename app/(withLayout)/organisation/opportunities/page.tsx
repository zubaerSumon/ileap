"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusIcon, Calendar, Users, UserCheck } from "lucide-react";
import { trpc } from "@/utils/trpc";
import type { Opportunity } from "@/types/opportunities";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import OpportunityTabs from "@/components/layout/organisation/opportunities/OpportunityTabs";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { usePagination } from "@/hooks/usePagination";
import { useRouter } from "next/navigation";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";

export default function OpportunitiesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("open");

  const { data: opportunities, isLoading } =
    trpc.opportunities.getOrganizationOpportunities.useQuery();

  // Use the pagination hook
  const { currentPage, totalPages, paginatedData, setCurrentPage, totalItems } =
    usePagination(opportunities || [], {
      pageSize: 4,
      initialPage: 1,
    });

  const columnHelper = createColumnHelper<Opportunity>();

  const columns = [
    columnHelper.display({
      id: "role",
      header: () => <span>Role name</span>,
      cell: (info) => {
        const org = info.row.original.organization_profile;
        return (
          <div className="flex items-center gap-3 min-h-[64px]">
            <Avatar className="size-8">
              <AvatarImage
                src={org?.profile_img || "/avatar.svg"}
                alt={org?.title || "Org"}
              />
              <AvatarFallback>{org?.title?.slice(0, 2) || "CO"}</AvatarFallback>
            </Avatar>
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
        if (!opportunity.start_date) {
          return (
            <div className="w-full text-center text-gray-400">Not set</div>
          );
        }

        const startDate = new Date(opportunity.start_date);
        const formattedDate = startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div className="w-full text-center">
            <div className="text-sm font-medium">{formattedDate}</div>
            <div className="text-xs text-gray-500">
              {opportunity.start_time ? formatTimeToAMPM(opportunity.start_time) : 'Time TBD'}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/organisation/opportunities/${info.row.original._id}`
                )
              }
            >
              View Application
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            {activeTab !== "archived" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
    const startDate = opportunity.start_date ? new Date(opportunity.start_date) : null;
    const formattedDate = startDate ? startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) : "Not set";

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="size-10">
              <AvatarImage
                src={org?.profile_img || "/avatar.svg"}
                alt={org?.title || "Org"}
              />
              <AvatarFallback>{org?.title?.slice(0, 2) || "CO"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate">{opportunity.title}</h3>
              <p className="text-sm text-[#246BFD] font-medium">{org?.title || "Organization"}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/organisation/opportunities/${opportunity._id}`)}
              >
                View Application
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              {activeTab !== "archived" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="font-medium">{formattedDate}</p>
              <p className="text-xs text-gray-500">
                {opportunity.start_time ? formatTimeToAMPM(opportunity.start_time) : 'Time TBD'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="font-medium">{opportunity.applicantCount || 0}</p>
              <p className="text-xs text-gray-500">Applicants</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <UserCheck className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">{opportunity.recruitCount || 0}</span>
          <span className="text-xs text-gray-500">Recruits</span>
        </div>
      </div>
    );
  };

  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] min-h-screen">
        <div className="max-w-[1240px] py-4 md:py-8 px-4 mx-auto">
          <div className="bg-white rounded-lg">
            <div className="px-4 pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold mb-1">Opportunities</h1>
                  <p className="text-sm text-gray-500">Posted tasks</p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center w-full sm:w-auto"
                  size="lg"
                  onClick={() =>
                    router.push("/organisation/opportunities/create")
                  }
                >
                  <PlusIcon className="mr-2 transform scale-170" />
                  Post an opportunity
                </Button>
              </div>
              <OpportunityTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                openCount={totalItems}
              />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block px-4">
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
                <div className="flex justify-center items-center py-10 text-gray-500">
                  Loading...
                </div>
              ) : paginatedData.length === 0 ? (
                <div className="flex justify-center items-center py-10 text-gray-500">
                  No opportunities found.
                </div>
              ) : (
                table.getRowModel().rows.map((row) => (
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
                ))
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden px-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-10 text-gray-500">
                  Loading...
                </div>
              ) : paginatedData.length === 0 ? (
                <div className="flex justify-center items-center py-10 text-gray-500">
                  No opportunities found.
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedData.map((opportunity) => (
                    <OpportunityCard key={opportunity._id} opportunity={opportunity} />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 flex items-center justify-center">
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
