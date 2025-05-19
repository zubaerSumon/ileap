"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";
import { ApplyButton } from "@/components/buttons/ApplyButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import mapPinGrayIcon from "../../../../public/icons/map-pin-gray-icon.svg";
import { trpc } from "@/utils/trpc";
import fileIcon from "../../../../public/icons/file-icon.svg";
import mapPinIcon from "../../../../public/icons/map-pin-icon.svg";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type OpportunityDetails = {
  id: string;
  title: string;
  organization: {
    title: string;
    id: string;
  };
  date: string;
  time: string;
  location: string;
};

export default function Categories() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteOpportunities');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Fetch all opportunities
  const { data: opportunities } = trpc.opportunities.getAllOpportunities.useQuery();
  
  // Fetch all applications to calculate available spots
  const { data: applications } = trpc.volunteers.getVolunteerApplications.useQuery();

  const toggleFavorite = (opportunityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = prev.includes(opportunityId)
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId];
      
      localStorage.setItem('favoriteOpportunities', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Calculate available spots for each opportunity
  const opportunitiesWithSpots = opportunities?.map((opportunity) => {
    const appliedCount = (applications as Array<{ opportunity: string; status: string }> | undefined)?.filter(
      (app) => 
        app.opportunity === opportunity._id.toString() && 
        (app.status === 'pending' || app.status === 'approved')
    ).length || 0;
    
    const spotsAvailable = Math.max(0, opportunity.number_of_volunteers - appliedCount);
    
    return {
      ...opportunity,
      spotsAvailable,
    };
  }) || [];

  const filteredOpportunities = activeTab === "favorites"
    ? opportunitiesWithSpots.filter(opp => favorites.includes(opp._id.toString()))
    : opportunitiesWithSpots;

  return (
    <section className="w-full md:w-[57%] relative">
      <h1 className="text-[#101010] font-inter text-xxl font-bold text-center mt-8 mb-5">
        Volunteering Opportunities during National Volunteer Week 2025 (19 - 25
        May)
      </h1>

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="all" 
            onClick={() => setActiveTab("all")}
          >
            All Opportunities
          </TabsTrigger>
          <TabsTrigger 
            value="favorites" 
            onClick={() => setActiveTab("favorites")}
          >
            Favorites ({favorites.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-6">
        {filteredOpportunities.map((opportunity) => (
          <Card
            key={opportunity._id}
            className="rounded-lg overflow-hidden w-full py-0 h-[340px] cursor-pointer hover:shadow-lg transition-shadow relative"
            onClick={() =>
              router.push(`/volunteer/opportunities/${opportunity._id}`)
            }
          >
            <CardContent className="px-4 pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Image
                    src={
                      opportunity?.organization_profile?.profile_img ||
                      "/default-org-logo.svg"
                    }
                    alt={
                      opportunity?.created_by?.name || "Unknown Organization"
                    }
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-1" />
                      <span className="text-sm">
                        <span className="font-medium text-green-600">
                          {opportunity.spotsAvailable}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {opportunity.number_of_volunteers}
                        </span>{" "}
                        spots left
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold line-clamp-1">
                  {opportunity.title}
                </h3>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Image
                      src={mapPinIcon}
                      height={16}
                      width={16}
                      className="mr-1"
                      alt="Map pin icon"
                    />
                    <span className="">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Image
                      src={fileIcon}
                      height={16}
                      width={16}
                      className="mr-1"
                      alt="File icon"
                    />
                    <span className="">
                      {opportunity.commitment_type === "oneoff"
                        ? "One off"
                        : "Regular"}
                      ;{" "}
                      {new Date(opportunity.date.start_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {opportunity.category.map((category: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-sm bg-[#F0F0F0] rounded-[4px] font-normal"
                    >
                      {category}
                    </Badge>
                  ))}
                  <div className="flex items-center w-[150px] rounded-[4px] bg-[#EBF8F4] p-1">
                    <Image
                      src={mapPinGrayIcon}
                      height={16}
                      width={16}
                      className="mr-1"
                      alt="Map pin gray icon"
                    />
                    <span className="text-sm text-green-600">
                      Matching location
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div
                    className="text-sm text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: opportunity.description,
                    }}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="absolute bottom-0 left-0 right-0 flex items-center px-4 pb-5">
              <div className="flex items-center gap-2">
                <div onClick={(e) => e.stopPropagation()}>
                  <ApplyButton
                    opportunityId={opportunity._id.toString()}
                    opportunityDetails={{
                      id: opportunity._id.toString(),
                      title: opportunity.title,
                      organization: {
                        title: opportunity.organization_profile?.title || "",
                        id: opportunity.organization_profile?._id || "",
                      },
                      date: new Date(
                        opportunity.date.start_date
                      ).toLocaleDateString("en-GB"),
                      time: `${opportunity.time.start_time} - ${opportunity.time.end_time}`,
                      location: opportunity.location,
                    }}
                  />
                </div>
                <Star 
                  className={`h-5 w-5 cursor-pointer ${
                    favorites.includes(opportunity._id.toString())
                      ? "text-yellow-400 fill-current"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => toggleFavorite(opportunity._id.toString(), e)}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
