"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { GiBinoculars } from "react-icons/gi";
import { Building2 } from "lucide-react";
import OpportunitiesTab from "./OpportunitiesTab";
import OrganizationsTab from "./OrganizationsTab";
import { TabConfig } from "@/types/opportunities";

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

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Tabs
          defaultValue="opportunities"
          className="w-full gap-0"
          onValueChange={setActiveTab}
        >
          <TabsList className="shadow-none bg-transparent border-gray-200 w-full">
            {tabConfig.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`py-2 md:py-3 px-2 md:px-0 border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:text-orange-500 rounded-none text-sm md:text-base text-gray-600 hover:text-orange-400 bg-transparent data-[state=active]:bg-transparent shadow-none flex-1 md:flex-none ${
                    index === 0 ? "md:mr-8 md:ml-0" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                    {IconComponent && <IconComponent className="h-4 w-4 md:h-5 md:w-5" />}
                    <span className="text-xs md:text-base">{tab.label}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {activeTab === "organizations" && (
            <Separator className="my-0 border-gray-200 border-2" />
          )}

          {tabConfig.map((tab) => {
            const TabComponent = tab.component;
            return (
              <TabsContent key={tab.value} value={tab.value}>
                <TabComponent />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
