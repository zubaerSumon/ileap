"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { MoreHorizontal } from "lucide-react";
import { trpc } from "@/utils/trpc";
import type { Opportunity } from "@/types/opportunities";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import OpportunityTabs from "@/components/layout/organisation/opportunities/OpportunityTabs";
import { useRouter } from "next/navigation";

export default function OpportunitiesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("open");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 4;

  const { data: opportunities, isLoading } =
    trpc.opportunities.getOrganizationOpportunities.useQuery();

  // Pagination logic
  const paginatedData = (opportunities || []).slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

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
                  `/organization/opportunities/${info.row.original._id}`
                )
              }
            >
              View Application
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
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
    pageCount: Math.ceil((opportunities?.length || 0) / pageSize),
    state: { pagination: { pageIndex, pageSize } },
  });

  const totalPages = Math.ceil((opportunities?.length || 0) / pageSize);

  return (
    <ProtectedLayout>
      <div className="bg-[#F5F7FA] ">
        <div className="max-w-[1240px] py-8 h-[900px] mx-auto overflow-auto">
          <div className="bg-white rounded-lg">
            <div className="px-4 pt-5">
              <h1 className="text-2xl font-semibold mb-1">Opportunities</h1>
              <p className="text-sm text-gray-500 mb-6">Posted tasks</p>
              <OpportunityTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                openCount={opportunities?.length || 0}
              />
            </div>

            <div className="p-4 flex justify-between items-center">
              <Input placeholder="Search" className="max-w-sm" />
              <Button
                variant="outline"
                size="sm"
                className="h-[33px] px-3 flex items-center gap-1.5 bg-[#F0F1F2] border-0"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="px-4">
              <div className="flex items-center py-3 px-6 bg-gray-50 text-sm text-gray-500 rounded-md">
                {table.getHeaderGroups().map((headerGroup) => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <div
                        key={header.id}
                        className={
                          header.id === "role"
                            ? "flex-1"
                            : header.id === "actions"
                            ? "w-[60px] text-center"
                            : "w-[160px] text-center"
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
                            : cell.column.id === "actions"
                            ? "w-[60px] text-center"
                            : "w-[160px] text-center"
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

            <div className="p-4 flex items-center justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPageIndex((prev) => Math.max(prev - 1, 0));
                      }}
                      className={
                        pageIndex === 0 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={i === pageIndex}
                        onClick={(e) => {
                          e.preventDefault();
                          setPageIndex(i);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPageIndex((prev) =>
                          Math.min(prev + 1, totalPages - 1)
                        );
                      }}
                      className={
                        pageIndex === totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
