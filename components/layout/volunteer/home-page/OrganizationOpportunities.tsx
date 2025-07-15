"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { Loader2, Heart, Briefcase } from "lucide-react";
import OpportunityCard from "../find-opportunity/OpportunityCard";
import { Opportunity } from "@/types/opportunities";
import EmptyState from "@/components/layout/shared/EmptyState";

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

   const {
    data: opportunitiesData,
    isLoading,
    error,
  } = trpc.opportunities.getAllOpportunities.useQuery({
    page: 1,
    limit: 50,
  });

   const { data: applications } =
    trpc.applications.getVolunteerApplications.useQuery(volunteerId!, {
      enabled: !!volunteerId,
    });

   const { data: favoriteOpportunities } =
    trpc.volunteers.getFavoriteOpportunities.useQuery();

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

   const organizationOpportunities =
    opportunitiesData?.opportunities?.filter(
      (opp) =>
        (opp as unknown as Opportunity).organization_profile?._id ===
        organizationId
    ) || [];

   const opportunitiesWithSpots = organizationOpportunities.map(
    (opportunity) => {
      const opp = opportunity as unknown as Opportunity;
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

      return {
        ...opp,
        recruitCount: opp.number_of_volunteers - spotsAvailable,
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
        <EmptyState
          icon={activeTab === "favorites" ? Heart : Briefcase}
          title={
            activeTab === "favorites"
              ? "No Favourite Opportunities"
              : "No Opportunities Available"
          }
          description={
            activeTab === "favorites"
              ? "You haven't favourited any opportunities from this organisation yet. Browse all opportunities and add some to your favourites!"
              : isOrgAdminOrMentor && isUserFromThisOrg
              ? "Your organisation hasn't posted any opportunities yet. Create your first opportunity to get started!"
              : "This organisation hasn't posted any opportunities yet."
          }
          actionLabel={
            activeTab === "all" && isOrgAdminOrMentor && isUserFromThisOrg
              ? "Create Opportunity"
              : undefined
          }
          onAction={
            activeTab === "all" && isOrgAdminOrMentor && isUserFromThisOrg
              ? () => router.push("/organisation/opportunities/create")
              : undefined
          }
          variant="card"
          showAction={activeTab === "all" && isOrgAdminOrMentor && isUserFromThisOrg}
          className="min-h-[400px]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
            />
          ))}
        </div>
      )}
    </section>
  );
}
