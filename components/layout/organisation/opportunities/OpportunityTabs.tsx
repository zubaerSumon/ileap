"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TabItem {
  label: string;
  count: number;
  value: "open" | "draft" | "recruited" | "archived";
}

interface OpportunityTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  openCount?: number;
}

export default function OpportunityTabs({ activeTab, onTabChange, openCount = 0 }: OpportunityTabsProps) {
  const tabs: TabItem[] = [
    { label: "Open", count: openCount, value: "open" },
    { label: "Draft", count: 0, value: "draft" },
    { label: "Recruited", count: 0, value: "recruited" },
    { label: "Archived", count: 0, value: "archived" },
  ];

  return (
    <div className="mb-4">
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-4 w-full max-w-full overflow-hidden bg-[#F1F1F2] rounded-[30px]">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            variant={activeTab === tab.value ? "default" : "ghost"}
            className={`
              h-10 w-full px-2 rounded-[24px] transition-all
              ${activeTab === tab.value
                ? "bg-[#246BFD] text-white hover:bg-[#246BFD]/90"
                : "bg-transparent text-gray-600 hover:bg-[#246BFD]/10 hover:text-[#246BFD]"}
            `}
          >
            <span className="truncate">
              {tab.label} ({tab.count})
            </span>
          </Button>
        ))}
      </div>

      {/* Mobile Slider Layout */}
      <div className="md:hidden">
        {/* Scrollable Container */}
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide px-2 py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              variant={activeTab === tab.value ? "default" : "ghost"}
              className={`
                flex-shrink-0 h-10 px-4 rounded-[20px] transition-all whitespace-nowrap
                ${activeTab === tab.value
                  ? "bg-[#246BFD] text-white hover:bg-[#246BFD]/90 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-[#246BFD]/10 hover:text-[#246BFD] border border-gray-200"}
              `}
            >
              <span className="text-sm font-medium">
                {tab.label} ({tab.count})
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Separator - Only visible on mobile */}
      <div className="md:hidden mt-2">
        <Separator className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </div>
    </div>
  );
}