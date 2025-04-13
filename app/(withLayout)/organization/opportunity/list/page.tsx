"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import OpportunityTabs from "./components/OpportunityTabs";
import OpportunityCard from "./components/OpportunityCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("open");

  const opportunities = [
    {
      title: "Seek help",
      organization: "Charity Organisation",
      postedDate: "17 Jan 2025",
      applicants: 30,
      recruits: 30,
    },
    {
      title: "Youth Mentors Wanted",
      organization: "Charity Organisation",
      postedDate: "17 Jan 2025",
      applicants: 20,
      recruits: 20,
    },
    {
      title: "Environmental Champions Needed!",
      organization: "Charity Organisation",
      postedDate: "17 Jan 2025",
      applicants: 35,
      recruits: 35,
    },
    {
      title: "Disaster Relief Helpers",
      organization: "Charity Organisation",
      postedDate: "17 Jan 2025",
      applicants: 40,
      recruits: 40,
    },
  ];

  return (
    <div className="w-[1048px] h-[900px] bg-[#F5F7FA] mx-auto overflow-auto">
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 pt-5">
            <h1 className="text-2xl font-semibold mb-1">Opportunities</h1>
            <p className="text-sm text-gray-500 mb-6">Posted tasks</p>

            <OpportunityTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="p-4 flex justify-between items-center">
            <Input 
              placeholder="Search" 
              className="max-w-sm"
            />
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
            <div className="flex items-center py-3 px-6 bg-gray-50 text-sm text-gray-500">
              <div className="flex-1">Role name</div>
              <div className="flex w-[400px] mr-8">
                <div className="w-[200px] text-center">Applicants</div>
                <div className="w-[200px] text-center">Recruits</div>
              </div>
            </div>

            {opportunities.map((opportunity, index) => (
              <OpportunityCard
                key={index}
                {...opportunity}
              />
            ))}
          </div>

          <div className="p-4 flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
