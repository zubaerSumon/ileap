"use client";
import { useState } from "react";
// import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { ChevronRight, PlusIcon } from "lucide-react";
import VolunteerCarousel from "./VolunteerCarousel";
import { useSession } from "next-auth/react";
import OpenContent from "./OpenContent";
import ActiveContent from "./ActiveContent";
import DraftContent from "./DraftContent";
import MessageDialog from "../MessageDialog";
import { Opportunity } from "@/types/opportunities";

interface Volunteer {
  _id: string;
  name: string;
  avatar?: string;
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
}

interface ActiveContract {
  id: string;
  profileImg?: string;
  jobTitle: string;
  freelancerName: string;
  startedAt: string;
}

const TABS = [
  { key: "open", label: "Open opportunity posts" },
  { key: "active", label: "Active contracts" },
  { key: "draft", label: "Draft opportunity posts" },
];

const OrganisationDashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  // Fetch opportunities
  const { data: opportunities, isLoading: isLoadingOpportunities } =
    trpc.opportunities.getOrganizationOpportunities.useQuery(undefined, {
      select: (data) => data as Opportunity[]
    });
  // Fetch recruited applicants for 'active' tab
  const { data: recruitedApplicants, isLoading: isLoadingRecruited } =
    trpc.recruits.getRecruitedApplicants.useQuery(
      { opportunityId: opportunities?.[0]?._id || "" },
      { 
        enabled: !!opportunities?.[0]?._id,
        select: (data) => data as RecruitedApplicant[]
      }
    );
  // Fetch available volunteers
  const { data: availableVolunteers, isLoading: isLoadingVolunteers } =
    trpc.users.getAvailableUsers.useQuery(undefined, {
      select: (data) => data as Volunteer[]
    });

  // Tab state
  const [tab, setTab] = useState("open");

  // Map recruited applicants to active contracts
  const activeContracts: ActiveContract[] = (recruitedApplicants || []).map((c) => ({
    id: c.id,
    profileImg: c.profileImg,
    jobTitle: "Active Contract", // This should come from the opportunity data
    freelancerName: c.name,
    startedAt: new Date().toISOString().split('T')[0], // This should come from the contract data
  }));

  // Filtered data for tabs
  const openOpportunities = opportunities?.filter((opp) => {
    const startDate = new Date(opp.date.start_date);
    return startDate > new Date();
  }) || [];
  const draftOpportunities = opportunities?.filter((opp) => {
    const startDate = new Date(opp.date.start_date);
    return startDate <= new Date();
  }) || [];

  // Transform available volunteers data for the carousel
  const previousVolunteers = availableVolunteers?.map((volunteer) => ({
    _id: volunteer._id,
    name: volunteer.name || "Anonymous",
    avatar: volunteer.avatar || "/avatar.svg",
    role: volunteer.role || "Volunteer",
    volunteer_profile: volunteer.volunteer_profile
  })) || [];

  const handleSendMessage = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsMessageDialogOpen(true);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-6 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-bold tracking-tight">
          Good afternoon, {session?.user?.name || "Org Name"}
        </h2>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center w-full md:w-auto"
            size="lg"
            onClick={() => router.push("/organization/opportunities/create")}
          >
            <PlusIcon className="mr-2 transform scale-170" />
            Post an opportunity
          </Button>
        </div>
      </div>
      {/* Overview Section */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Overview</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
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
              style={{ minWidth: 'auto' }}
            >
              {t.label} (
              {t.key === "open"
                ? openOpportunities.length
                : t.key === "active"
                ? activeContracts.length
                : draftOpportunities.length}
              )
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors whitespace-nowrap hover:text-blue-800"
          onClick={() => router.push("/organization/contracts")}
        >
          View all contracts{" "}
          <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {/* Active Contracts List */}
      <div className="transition-all duration-300 ease-in-out">
        {tab === "active" && (
          <ActiveContent
            activeContracts={activeContracts}
            isLoadingRecruited={isLoadingRecruited}
          />
        )}
        {/* Open opportunity Posts List */}
        {tab === "open" && (
          <OpenContent
            openOpportunities={openOpportunities}
            isLoadingOpportunities={isLoadingOpportunities}
            router={router}
          />
        )}
        {/* Draft opportunity Posts List */}
        {tab === "draft" && (
          <DraftContent
            draftOpportunities={draftOpportunities}
            isLoadingOpportunities={isLoadingOpportunities}
            router={router}
          />
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
            onClick={() => router.push("/organization/hires")}
          >
            View recent volunteers{" "}
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
    </div>
  );
};

export default OrganisationDashboard;
