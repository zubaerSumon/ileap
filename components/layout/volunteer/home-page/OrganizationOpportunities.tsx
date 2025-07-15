"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { ApplyButton } from "@/components/buttons/ApplyButton";
import { FavoriteButton } from "@/components/buttons/FavoriteButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { trpc } from "@/utils/trpc";
import fileIcon from "../../../../public/icons/file-icon.svg";
import mapPinIcon from "../../../../public/icons/map-pin-icon.svg";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";
import { Loader2 } from "lucide-react";

export type OpportunityDetails = {
  id: string;
  title: string;
  organization: {
    title: string;
    id: string;
  };
  location: string;
};

interface OpportunityData {
  _id: string;
  title: string;
  description: string;
  category: string[];
  required_skills: string[];
  commitment_type: string;
  location: string;
  number_of_volunteers: number;
  date: {
    start_date: Date;
    end_date?: Date;
  };
  time: {
    start_time: string;
    end_time?: string;
  };
  organization_profile: {
    _id: string;
    title: string;
    profile_img?: string;
  };
  created_by?: {
    _id: string;
    name: string;
  };
  recurrence?: {
    date_range: {
      start_date: Date;
      end_date?: Date;
    };
  };
  spotsAvailable?: number;
  formattedDates?: {
    start_date: string;
    end_date?: string;
  };
  [key: string]: unknown;
}

interface OrganizationOpportunitiesProps {
  organizationId: string;
}

export default function OrganizationOpportunities({
  organizationId,
}: OrganizationOpportunitiesProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { data: session } = useSession();
  const volunteerId = session?.user?.id;

  // Fetch opportunities for the specific organization
  const {
    data: opportunitiesData,
    isLoading,
    error,
  } = trpc.opportunities.getAllOpportunities.useQuery({
    page: 1,
    limit: 50,
  });

  // Fetch all applications to calculate available spots
  const { data: applications } =
    trpc.applications.getVolunteerApplications.useQuery(volunteerId!, {
      enabled: !!volunteerId,
    });

  // Fetch user's favorite opportunities
  const { data: favoriteOpportunities } =
    trpc.volunteers.getFavoriteOpportunities.useQuery();

  // Check if current user is admin or mentor of this organization
  const isOrgAdminOrMentor =
    session?.user?.role === "admin" || session?.user?.role === "mentor";
  const userOrgId = session?.user?.organization_profile?._id;
  const isUserFromThisOrg = userOrgId === organizationId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Error loading opportunities
        </h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    );
  }

  // Filter opportunities to only show those from the specific organization
  const organizationOpportunities =
    opportunitiesData?.opportunities?.filter(
      (opp) =>
        (opp as unknown as OpportunityData).organization_profile?._id ===
        organizationId
    ) || [];

  // Calculate available spots for each opportunity
  const opportunitiesWithSpots = organizationOpportunities.map(
    (opportunity) => {
      const opp = opportunity as unknown as OpportunityData;
      const appliedCount =
        (
          applications as
            | Array<{ opportunity: string; status: string }>
            | undefined
        )?.filter(
          (app) =>
            app.opportunity === opp._id.toString() &&
            (app.status === "pending" || app.status === "approved")
        ).length || 0;

      const spotsAvailable = Math.max(
        0,
        opp.number_of_volunteers - appliedCount
      );

      // Format dates if they exist
      const formattedDates = opp.recurrence?.date_range
        ? {
            start_date: format(
              new Date(opp.recurrence.date_range.start_date),
              "MMM d"
            ),
            end_date: opp.recurrence.date_range.end_date
              ? format(new Date(opp.recurrence.date_range.end_date), "MMM d")
              : undefined,
          }
        : undefined;

      return {
        ...opp,
        spotsAvailable,
        formattedDates,
      };
    }
  );

  const filteredOpportunities =
    activeTab === "favorites"
      ? opportunitiesWithSpots.filter((opp) =>
          favoriteOpportunities?.some(
            (fav) => fav.opportunity === opp._id.toString()
          )
        )
      : opportunitiesWithSpots;

  return (
    <section className="w-full relative">
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
            All Opportunities ({opportunitiesWithSpots.length})
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            onClick={() => setActiveTab("favorites")}
          >
            Favourites (
            {favoriteOpportunities?.filter((fav) =>
              opportunitiesWithSpots.some(
                (opp) => opp._id.toString() === fav.opportunity
              )
            ).length || 0}
            )
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            {activeTab === "favorites"
              ? "No Favourite Opportunities"
              : "No Opportunities Available"}
          </h2>
          <p className="text-gray-500">
            {activeTab === "favorites"
              ? "You haven't favourited any opportunities from this organisation yet. Browse all opportunities and add some to your favourites!"
              : isOrgAdminOrMentor && isUserFromThisOrg
              ? "Your organisation hasn't posted any opportunities yet. Create your first opportunity to get started!"
              : "This organisation hasn't posted any opportunities yet."}
          </p>
          {activeTab === "all" && isOrgAdminOrMentor && isUserFromThisOrg && (
            <div className="mt-4">
              <button
                onClick={() =>
                  router.push("/organisation/opportunities/create")
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Opportunity
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredOpportunities.map((opportunity) => (
            <Card
              key={opportunity._id}
              className="rounded-lg overflow-hidden w-full py-0 h-[340px] cursor-pointer hover:shadow-lg transition-shadow relative"
              onClick={() =>
                router.push(`/find-opportunity/opportunity/details/${opportunity._id}`)
              }
            >
              <CardContent className="px-4 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Image
                      src={
                        opportunity?.organization_profile?.profile_img ||
                        "/avatar.svg"
                      }
                      alt={
                        opportunity?.created_by?.name || "Unknown Organisation"
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
                      <p className="text-sm text-gray-500">
                        {opportunity.commitment_type === "workbased"
                          ? "Work based"
                          : "Event based"}
                      </p>
                    </div>
                    {opportunity.formattedDates && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="text-sm text-gray-500">
                          {opportunity.formattedDates.start_date}
                          {opportunity.formattedDates.end_date
                            ? ` - ${opportunity.formattedDates.end_date}`
                            : ""}
                        </span>
                      </div>
                    )}
                    {!opportunity.formattedDates &&
                      opportunity.date?.start_date && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="text-sm text-gray-500">
                            {format(
                              new Date(opportunity.date.start_date),
                              "MMM d"
                            )}{" "}
                            at{" "}
                            {opportunity.time?.start_time
                              ? formatTimeToAMPM(opportunity.time.start_time)
                              : "Time TBD"}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {opportunity.category.slice(0, 1).map(
                      (category: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-sm bg-[#F0F0F0] rounded-[4px] font-normal"
                        >
                          {category}
                        </Badge>
                      )
                    )}
                    {opportunity.category.length > 1 && (
                      <Badge
                        variant="secondary"
                        className="text-sm bg-[#F0F0F0] rounded-[4px] font-normal text-gray-500"
                      >
                        +{opportunity.category.length - 1} more
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div
                      className="text-sm text-gray-600 line-clamp-3 overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: opportunity.description.replace(/<[^>]*>/g, ""),
                      }}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="absolute bottom-0 left-0 right-0 flex items-center px-4 pb-5">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2"
                >
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
                        location: opportunity.location,
                      }}
                      opportunityDate={opportunity.date}
                    />
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton opportunityId={opportunity._id} />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
