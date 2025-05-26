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

const TABS = [
  { key: "open", label: "Open opportunity posts" },
  { key: "active", label: "Active contracts" },
  { key: "draft", label: "Draft opportunity posts" },
];

const OrganisationDashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Fetch opportunities
  const { data: opportunities, isLoading: isLoadingOpportunities } =
    trpc.opportunities.getOrganizationOpportunities.useQuery();
  // Fetch recruited applicants for 'active' tab
  const { data: recruitedApplicants, isLoading: isLoadingRecruited } =
    trpc.recruits.getRecruitedApplicants.useQuery(
      { opportunityId: opportunities?.[0]?._id || "" },
      { enabled: !!opportunities?.[0]?._id }
    );

  // Tab state
  const [tab, setTab] = useState("open");

  // Use only placeholder values for opportunity title and start date in active contracts
  const activeContracts = (recruitedApplicants || []).map((c, i) => ({
    ...c,
    opportunityTitle: [
      "User Experience Designer (UI/UX)",
      "Looking a React.js Developer for Stadion App",
    ][i % 2],
    freelancerName: c.name || ["Oyewumi Olukunle", "Mayowa Dabiri"][i % 2],
    startedAt: ["2023-11-05", "2023-04-01"][i % 2],
  }));

  // Filtered data for tabs (replace with real logic as needed)
  const openOpportunities = opportunities?.filter((opp) => !opp.isDraft) || [];
  const draftOpportunities = opportunities?.filter((opp) => opp.isDraft) || [];

  // Placeholder for previously engaged volunteers
  const previousVolunteers = [
    {
      id: "1",
      name: "Mayowa D.",
      country: "Nigeria",
      jobs: 2,
      rate: "$30/hr",
      lastContract: "Looking a React.js Developer for Stadion App",
      avatar: "/avatar.svg",
    },
    {
      id: "2",
      name: "Oyewumi O.",
      country: "Nigeria",
      jobs: 1,
      rate: "$5/hr",
      lastContract: "User Experience Designer (UI/UX)",
      avatar: "/avatar.svg",
    },
    {
      id: "3",
      name: "Ifrah S.",
      country: "India",
      jobs: 146,
      rate: "$25/hr",
      lastContract: "Packet Tracer Assignment",
      avatar: "/avatar.svg",
    },
    {
      id: "4",
      name: "Kirtan P.",
      country: "India",
      jobs: 49,
      rate: "$20/hr",
      lastContract: "Talented UI/UX Designer",
      avatar: "/avatar.svg",
    },
    {
      id: "5",
      name: "Aisha M.",
      country: "Kenya",
      jobs: 12,
      rate: "$18/hr",
      lastContract: "Full Stack Developer",
      avatar: "/avatar.svg",
    },
    {
      id: "6",
      name: "Lucas R.",
      country: "Brazil",
      jobs: 7,
      rate: "$22/hr",
      lastContract: "Mobile App Specialist",
      avatar: "/avatar.svg",
    },
    {
      id: "7",
      name: "Sofia G.",
      country: "Spain",
      jobs: 15,
      rate: "$28/hr",
      lastContract: "UI/UX Consultant",
      avatar: "/avatar.svg",
    },
    {
      id: "8",
      name: "John T.",
      country: "USA",
      jobs: 33,
      rate: "$35/hr",
      lastContract: "React Native Developer",
      avatar: "/avatar.svg",
    },
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg md:text-xl font-bold tracking-tight">
          Good afternoon, {session?.user?.name || "Org Name"}
        </h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-0 rounded-lg transition-transform active:scale-95 flex items-center"
          size="lg"
          onClick={() => router.push("/organization/opportunities/create")}
        >
          <PlusIcon size={48} className="mr-2" />
          Post an opportunity
        </Button>
      </div>
      {/* Overview Section */}
      <h2 className="text-xl md:text-2xl font-semibold mb-2">Overview</h2>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
                ${
                  tab === t.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                }
              `}
              onClick={() => setTab(t.key)}
              style={{ minWidth: 150 }}
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
          className="flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors"
          onClick={() => router.push("/organization/contracts")}
        >
          View all contracts{" "}
          <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700" />
        </button>
      </div>
      {/* Active Contracts List */}
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
      {/* Work together again section */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold">
            Work together again on something new
          </h3>
          <button
            className="flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors"
            onClick={() => router.push("/organization/hires")}
          >
            View recent volunteers{" "}
            <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700" />
          </button>
        </div>
        <VolunteerCarousel volunteers={previousVolunteers} />
      </div>
    </div>
  );
};

export default OrganisationDashboard;
