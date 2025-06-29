"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode, useState } from "react";
import MobileTabsSlider from "@/components/shared/MobileTabsSlider";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  content: ReactNode;
}

interface DynamicTabsProps {
  defaultValue: string;
  tabs: TabItem[];
  className?: string;
}

export function DynamicTabs({
  defaultValue,
  tabs,
  className,
}: DynamicTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const mobileTabs = tabs.map((tab) => ({
    label: tab.label,
    value: tab.value,
    count: tab.count,
    icon: tab.icon,
  }));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className={className}>
      {/* Desktop Tabs - Show on large screens and above */}
      <div className={cn("hidden lg:block")}>
        <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 p-0 bg-gray-100 rounded-full h-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && ` (${tab.count})`}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Medium Screen Tabs - Show on medium screens only */}
      <div className={cn("hidden md:block lg:hidden")}>
        <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 p-0 bg-gray-100 rounded-full h-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-1 text-sm"
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
                {tab.count !== undefined && ` (${tab.count})`}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Mobile Tabs Slider - Show on small screens and below */}
      <div className={cn("block md:hidden")}>
        <MobileTabsSlider
          tabs={mobileTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Mobile Content */}
        <div className="mt-6">
          {tabs.find((tab) => tab.value === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}
