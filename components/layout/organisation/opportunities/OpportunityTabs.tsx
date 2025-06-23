"use client";

import { Button } from "@/components/ui/button";

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
    <div className="grid grid-cols-4 mb-6 w-full max-w-full overflow-hidden bg-[#F1F1F2] rounded-[30px]">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          variant={activeTab === tab.value ? "default" : "ghost"}
          className={`
            h-10 w-full px-1 sm:px-2 rounded-[24px] transition-all text-xs sm:text-sm
            ${activeTab === tab.value
              ? "bg-[#246BFD] text-white hover:bg-[#246BFD]/90"
              : "bg-transparent text-gray-600 hover:bg-[#246BFD]/10 hover:text-[#246BFD]"}
          `}
        >
          <span className="truncate">
            {tab.label} <span className="hidden sm:inline">({tab.count})</span>
            <span className="sm:hidden">({tab.count})</span>
          </span>
        </Button>
      ))}
    </div>
  );
}