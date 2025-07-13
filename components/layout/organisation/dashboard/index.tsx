"use client";
import { useState } from "react";
// import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { ChevronRight,   Trash2, MapPin } from "lucide-react";
import VolunteerCarousel from "./VolunteerCarousel";
import { useSession } from "next-auth/react";
import MessageDialog from "../MessageDialog";
import { Opportunity } from "@/types/opportunities";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { formatTimeToAMPM } from "@/utils/helpers/formatTime";
import { getGreeting } from "@/utils/helpers/getGreeting";
import { CreateOpportunityButton } from "@/components/buttons/CreateOpportunityButton";
import MobileTabsSlider from "@/components/layout/shared/MobileTabsSlider";
import UserAvatar from "@/components/ui/UserAvatar";

interface Volunteer {
  _id: string;
  name: string;
  image?: string;
  role: string;
  volunteer_profile?: {
    student_type?: "yes" | "no";
    course?: string;
    availability_date?: {
      start_date?: string;
      end_date?: string;
    };
    interested_on?: string[];
    bio?: string;
  };
}

interface RecruitedApplicant {
  readonly name: string;
  readonly email: string;
  readonly bio: string;
  readonly id: string;
  readonly location: string;
  readonly applicationId: string;
  readonly profileImg: string;
  readonly skills: string[];
  readonly completedProjects: number;
  readonly availability: string;
  readonly opportunity?: {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly category: string[];
    readonly location: string;
    readonly commitment_type: string;
  } | null;
}

interface ActiveContract {
  id: string;
  profileImg?: string;
  jobTitle: string;
  freelancerName: string;
  startedAt: string;
  opportunityTitle?: string;
  opportunityId?: string;
  uniqueKey: string; // Combined key for React rendering
  opportunities: Array<{
    id: string;
    title: string;
  }>;
}

const TABS = [
  { key: "open", label: "Open opportunity posts" },
  { key: "active", label: "Active volunteers" },
  { key: "archived", label: "Archived opportunity posts" },
];

const OrganisationDashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] =
    useState<Opportunity | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch opportunities
  const { data: opportunities, isLoading: isLoadingOpportunities } =
    trpc.opportunities.getOrganizationOpportunities.useQuery(undefined, {
      select: (data) => data as Opportunity[],
    });
  // Fetch recruited applicants for 'active' tab
  const { data: recruitedApplicants } =
    trpc.recruits.getRecruitedApplicants.useQuery(
      { opportunityId: "" }, // Empty string to get all recruited applicants
      {
        enabled: !!opportunities?.length,
        select: (data) => data as RecruitedApplicant[],
      }
    );
  // Fetch available volunteers
  const { data: availableVolunteersData, isLoading: isLoadingVolunteers } =
    trpc.users.getAvailableUsers.useQuery(
      {
        page: 1,
        limit: 10, // Get fewer volunteers for dashboard
      },
      {
        select: (data) => data.users as Volunteer[],
      }
    );

  const availableVolunteers = availableVolunteersData || [];

  // Tab state
  const [tab, setTab] = useState("open");

  // Map recruited applicants to active contracts grouped by volunteer
  const activeContracts: ActiveContract[] = (recruitedApplicants || []).reduce((acc, c) => {
    const existingContract = acc.find(contract => contract.id === c.id);
    
    if (existingContract) {
      // If volunteer already exists, add the opportunity to their list
      if (c.opportunity?.title && c.opportunity?.id) {
        const opportunityExists = existingContract.opportunities.some(opp => opp.id === c.opportunity?.id);
        if (!opportunityExists && c.opportunity?.id) {
          existingContract.opportunities.push({
            id: c.opportunity.id,
            title: c.opportunity.title
          });
        }
      }
    } else {
      // Create new contract for this volunteer
      acc.push({
        id: c.id,
        profileImg: c.profileImg,
        jobTitle: c.opportunity?.title || "Active Contract",
        freelancerName: c.name,
        startedAt: new Date().toISOString().split("T")[0],
        opportunityTitle: c.opportunity?.title,
        opportunityId: c.opportunity?.id,
        uniqueKey: `${c.id}-${c.opportunity?.id || ''}`,
        opportunities: c.opportunity?.id && c.opportunity?.title ? [{
          id: c.opportunity.id,
          title: c.opportunity.title
        }] : [],
      });
    }
    
    return acc;
  }, [] as ActiveContract[]);

  // Filtered data for tabs
  const openOpportunities =
    opportunities?.filter((opp) => !opp.is_archived) || [];
  const draftOpportunities: Opportunity[] = []; // Since we don't have draft status anymore
  const archivedOpportunities =
    opportunities?.filter((opp) => opp.is_archived) || [];

  // Transform available volunteers data for the carousel
  const previousVolunteers =
    availableVolunteers?.map((volunteer) => ({
      _id: volunteer._id,
      name: volunteer.name || "Anonymous",
      image: volunteer.image,
      role: volunteer.role || "Volunteer",
      volunteer_profile: volunteer.volunteer_profile,
    })) || [];

  const utils = trpc.useUtils();
  const archiveMutation = trpc.opportunities.archiveOpportunity.useMutation({
    onSuccess: () => {
      utils.opportunities.getOrganizationOpportunities.invalidate();
      setIsDeleteDialogOpen(false);
      setOpportunityToDelete(null);
    },
  });

  const deleteMutation = trpc.opportunities.deleteOpportunity.useMutation({
    onSuccess: () => {
      utils.opportunities.getOrganizationOpportunities.invalidate();
      setIsDeleteDialogOpen(false);
      setOpportunityToDelete(null);
      toast.success("Opportunity deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete opportunity:", error);
      toast.error(error.message || "Failed to delete opportunity");
      setIsDeleteDialogOpen(false);
      setOpportunityToDelete(null);
    },
  });

  const handleArchive = async (opportunity: Opportunity) => {
    try {
      await archiveMutation.mutateAsync(opportunity._id);
    } catch (error) {
      console.error("Failed to archive opportunity:", error);
    }
  };

  const handleDelete = async (opportunity: Opportunity) => {
    try {
      await deleteMutation.mutateAsync(opportunity._id);
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
    }
  };

  const handleSendMessage = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsMessageDialogOpen(true);
  };

  // Prepare mobile tabs data
  const mobileTabs = TABS.map((t) => ({
    label: t.label,
    value: t.key,
    count: t.key === "open"
      ? openOpportunities.length
      : t.key === "active"
      ? activeContracts.length
      : t.key === "draft"
      ? draftOpportunities.length
      : archivedOpportunities.length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-bold tracking-tight">
          {getGreeting()}, {session?.user?.name || "Org Name"}
        </h2>
        <CreateOpportunityButton />

      </div>
      {/* Overview Section */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Overview</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        {/* Mobile Tabs Slider */}
        <MobileTabsSlider
          tabs={mobileTabs}
          activeTab={tab}
          onTabChange={setTab}
          className="md:hidden"
        />

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`px-4 md:px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap shadow-sm hover:shadow-md
                ${
                  tab === t.key
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                }
              `}
              onClick={() => setTab(t.key)}
              style={{ minWidth: "auto" }}
            >
              {t.label} (
              {t.key === "open"
                ? openOpportunities.length
                : t.key === "active"
                ? activeContracts.length
                : t.key === "draft"
                ? draftOpportunities.length
                : archivedOpportunities.length}
              )
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors whitespace-nowrap hover:text-blue-800"
          onClick={() => router.push("/organisation/opportunities")}
        >
          View all opportunities{" "}
          <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {isLoadingOpportunities ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tab === "active"
              ? activeContracts.map((contract) => (
                  <div
                    key={contract.uniqueKey}
                    className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative h-[340px]"
                  >
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 mr-3">
                            <UserAvatar
                              user={{ name: contract.freelancerName, image: contract.profileImg }}
                              size={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {contract.freelancerName}
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 font-medium mb-1">
                                Active Opportunities ({contract.opportunities.length}):
                              </p>
                              <div className="space-y-1">
                                {contract.opportunities.map((opportunity) => (
                                  <p 
                                    key={opportunity.id}
                                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                                    onClick={() => {
                                      router.push(`/organisation/opportunities/${opportunity.id}`);
                                    }}
                                  >
                                    • {opportunity.title}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="font-medium">Volunteer</span>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="text-xs text-gray-500 mb-4">
                          Started{" "}
                          {formatDistanceToNow(new Date(contract.startedAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : (tab === "open"
                  ? openOpportunities
                  : tab === "draft"
                  ? draftOpportunities
                  : archivedOpportunities
                )?.map((opportunity) => (
                  <div
                    key={opportunity._id}
                    className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative h-[300px]"
                  >
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 mr-3">
                            <Image
                              src={
                                opportunity?.organization_profile
                                  ?.profile_img || "/avatar.svg"
                              }
                              alt={
                                opportunity?.organization_profile?.title ||
                                "Organization Logo"
                              }
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <h3
                            className="text-lg font-semibold cursor-pointer hover:text-blue-600"
                            onClick={() =>
                              router.push(
                                `/organisation/opportunities/${opportunity._id}`
                              )
                            }
                          >
                            {opportunity.title}
                          </h3>
                        </div>
                        {tab !== "archived" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpportunityToDelete(opportunity);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        <span>{opportunity.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge
                          variant="outline"
                          className="ml-2 px-2 py-0.5 text-xs"
                        >
                          {opportunity.commitment_type === "workbased"
                            ? "Work based"
                            : "Event based"}
                        </Badge>
                        {opportunity.category.slice(0, 1).map(
                          (cat: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {cat}
                            </Badge>
                          )
                        )}
                        {opportunity.category.length > 1 && (
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal text-gray-500"
                          >
                            +{opportunity.category.length - 1} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1">
                        <div
                          className="text-sm text-gray-600 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: opportunity.description,
                          }}
                        />
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="text-xs text-gray-500 mb-2">
                          Posted{" "}
                          {formatDistanceToNow(opportunity.createdAt, {
                            addSuffix: true,
                          })}
                        </div>
                        {opportunity.date?.start_date && (
                          <div className="text-xs text-gray-500">
                            Starts: {new Date(opportunity.date.start_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })} at {opportunity.time?.start_time ? formatTimeToAMPM(opportunity.time.start_time) : 'Time TBD'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
      {/* Work together again section */}
      <div className="py-8 mt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h3 className="text-lg md:text-xl font-semibold">
            Work together again on something new
          </h3>
          <button
            className="flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors whitespace-nowrap hover:text-blue-800"
            onClick={() => router.push("/find-volunteer")}
          >
            View All volunteers{" "}
            <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <VolunteerCarousel
          volunteers={previousVolunteers}
          isLoading={isLoadingVolunteers}
          onConnect={handleSendMessage}
        />
      </div>

      <MessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        volunteer={selectedVolunteer}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {tab === "archived"
                ? "This action cannot be undone. This will permanently delete the opportunity."
                : "This will move the opportunity to the archive. You can delete it permanently from there."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (opportunityToDelete) {
                  if (tab === "archived") {
                    handleDelete(opportunityToDelete);
                  } else {
                    handleArchive(opportunityToDelete);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {tab === "archived" ? "Delete" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganisationDashboard;
