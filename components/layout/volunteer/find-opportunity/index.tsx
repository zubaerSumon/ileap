"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { GiBinoculars } from "react-icons/gi";
import { Building2 } from "lucide-react";
import OpportunitiesTab from "./OpportunitiesTab";
import OrganizationsTab from "./OrganizationsTab";
import { TabConfig } from "@/types/opportunities";
import MobileTabsSlider from "@/components/ui/mobile-tabs-slider";

const tabConfig: TabConfig[] = [
  {
    value: "opportunities",
    label: "Find Volunteer Opportunities",
    icon: GiBinoculars,
    component: OpportunitiesTab,
  },
  {
    value: "organizations",
    label: "Organizations",
    icon: Building2,
    component: OrganizationsTab,
  },
];

export default function FindOpportunity() {
  const [activeTab, setActiveTab] = useState("opportunities");

  const mobileTabs = tabConfig.map((tab) => ({
    label: tab.label,
    value: tab.value,
    icon: tab.icon ? <tab.icon className="h-5 w-5" /> : undefined,
  }));

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MobileTabsSlider
          tabs={mobileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-6"
        />

        <div className="hidden sm:block">
          <Tabs
            value={activeTab}
            className="w-full gap-0"
            onValueChange={setActiveTab}
          >
            <TabsList className="shadow-none bg-transparent border-gray-200">
              {tabConfig.map((tab, index) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`py-3 px-0 border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:text-orange-500 rounded-none text-base text-gray-600 hover:text-orange-400 bg-transparent data-[state=active]:bg-transparent shadow-none ${
                      index === 0 ? "mr-8 ml-0" : ""
                    }`}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {activeTab === "organizations" && (
              <Separator className="my-0 border-gray-200 border-2" />
            )}
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className=" ">
          {tabConfig.map((tab) => {
            const TabComponent = tab.component;
            return (
              <div
                key={tab.value}
                className={activeTab === tab.value ? "block" : "hidden"}
              >
                <TabComponent />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
