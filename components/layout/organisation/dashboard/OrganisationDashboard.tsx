"use client";
import { useState } from "react";
// import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronRight, ChevronLeft, MessageCircle } from "lucide-react";

const TABS = [
  { key: "open", label: "Open job posts" },
  { key: "active", label: "Active contracts" },
  { key: "draft", label: "Draft job posts" },
];

const OrganisationDashboard = () => {
  const router = useRouter();
  // Fetch org profile for greeting (placeholder for now)
  const orgName = "Md"; // Replace with actual org name from profile endpoint

  // Fetch opportunities
  const { data: opportunities, isLoading: isLoadingOpportunities } = trpc.opportunities.getOrganizationOpportunities.useQuery();
  // Fetch recruited applicants for 'active' tab
  const { data: recruitedApplicants, isLoading: isLoadingRecruited } = trpc.recruits.getRecruitedApplicants.useQuery(
    { opportunityId: opportunities?.[0]?._id || "" },
    { enabled: !!opportunities?.[0]?._id }
  );

  // Tab state
  const [tab, setTab] = useState("open");

  // Use only placeholder values for job title and start date in active contracts
  const activeContracts = (recruitedApplicants || []).map((c, i) => ({
    ...c,
    jobTitle: [
      "User Experience Designer (UI/UX)",
      "Looking a React.js Developer for Stadion App"
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
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl md:text-3xl font-bold tracking-tight">Good afternoon, {orgName}</div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-transform active:scale-95" size="lg" onClick={() => router.push("/organization/opportunities/create")}>+ Post a job</Button>
      </div>
      {/* Overview Section */}
      <div className="text-lg md:text-xl font-semibold mb-2">Overview</div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
                ${tab === t.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}
              `}
              onClick={() => setTab(t.key)}
              style={{ minWidth: 150 }}
            >
              {t.label} ({
                t.key === "open"
                  ? openOpportunities.length
                  : t.key === "active"
                  ? activeContracts.length
                  : draftOpportunities.length
              })
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors"
          onClick={() => router.push("/organization/contracts")}
        >
          View all contracts <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700" />
        </button>
      </div>
      {/* Active Contracts List */}
      {tab === "active" && (
        <div className="space-y-0.5 mb-8">
          {isLoadingRecruited ? (
            <Skeleton className="h-28 w-full" />
          ) : activeContracts.length === 0 ? (
            <div className="text-muted-foreground">No active contracts.</div>
          ) : (
            activeContracts.map((contract, i) => (
              <div key={contract.id || i} className="bg-white border-b border-gray-200 flex flex-row items-center justify-between px-6 h-24 last:border-b-0">
                <div className="flex items-center gap-4 min-w-0 h-full w-1/3">
                  <img
                    src={contract.profileImg || "/avatar.svg"}
                    alt={contract.freelancerName}
                    className="h-12 w-12 rounded-full object-cover border border-gray-200"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-base truncate">{contract.jobTitle}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">{contract.freelancerName}</span>
                      <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">Active contract</span>
                      <span className="text-xs text-muted-foreground">Started {contract.startedAt ? format(new Date(contract.startedAt), "MMM d") : "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-row items-center justify-end gap-4 min-w-0 h-full">
                  <div className="flex-1 text-sm text-muted-foreground truncate text-right">Fund a new milestone for {contract.freelancerName} to keep working</div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2 transition-colors whitespace-nowrap active:scale-95 text-sm" title="Fund & activate milestone">Fund & activate milestone</button>
                  <button className="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors" title="Message"><MessageCircle className="h-4 w-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Open Job Posts List */}
      {tab === "open" && (
        <div className="space-y-0.5 mb-8">
          {isLoadingOpportunities ? (
            <Skeleton className="h-24 w-full" />
          ) : openOpportunities.length === 0 ? (
            <div className="text-muted-foreground">No open job posts.</div>
          ) : (
            openOpportunities.map((opportunity) => (
              <div key={opportunity._id} className="bg-white border-b border-gray-200 flex flex-row items-center justify-between px-6 h-24 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate">{opportunity.title}</div>
                  <div className="text-xs text-muted-foreground">Posted {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}</div>
                </div>
                <div className="flex gap-2 ml-4 items-center">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors" onClick={() => router.push(`/organization/opportunities/${opportunity._id}/applications`)}>View Applications</Button>
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors" onClick={() => router.push(`/organization/opportunities/${opportunity._id}/edit`)}>Edit</Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Draft Job Posts List */}
      {tab === "draft" && (
        <div className="space-y-0.5 mb-8">
          {isLoadingOpportunities ? (
            <Skeleton className="h-24 w-full" />
          ) : draftOpportunities.length === 0 ? (
            <div className="text-muted-foreground">No draft job posts.</div>
          ) : (
            draftOpportunities.map((opportunity) => (
              <div key={opportunity._id} className="bg-white border-b border-gray-200 flex flex-row items-center justify-between px-6 h-24 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate">{opportunity.title}</div>
                  <div className="text-xs text-muted-foreground">Draft</div>
                </div>
                <div className="flex gap-2 ml-4 items-center">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors" onClick={() => router.push(`/organization/opportunities/${opportunity._id}/edit`)}>Edit Draft</Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Work together again section */}
      <div className="bg-blue-50/40 rounded-xl py-8 px-2 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold">Work together again on something new</h3>
          <button
            className="flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm transition-colors"
            onClick={() => router.push("/organization/hires")}
          >
            View all hires <ChevronRight className="inline h-4 w-4 ml-1 text-blue-700" />
          </button>
        </div>
        <div className="relative">
          {/* Fade left */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-blue-50/80 to-transparent z-10" />
          {/* Fade right */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-blue-50/80 to-transparent z-10" />
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            <div className="flex items-center h-full">
              <button className="border border-blue-600 text-blue-700 bg-white rounded-full p-2 hover:bg-blue-100 shrink-0 flex items-center justify-center transition-colors" title="Scroll left"><ChevronLeft /></button>
            </div>
            <div className="flex gap-4 items-center">
              {previousVolunteers.map((vol) => (
                <div key={vol.id} className="min-w-[260px] max-w-[260px] flex flex-col items-center p-4 bg-white border border-gray-200 rounded-xl group cursor-pointer">
                  <img src={vol.avatar} alt={vol.name} className="h-12 w-12 rounded-full mb-2 object-cover border border-gray-200 group-hover:border-blue-400 transition" />
                  <div className="font-medium text-center text-base">{vol.name}</div>
                  <div className="text-xs text-muted-foreground text-center mb-1">{vol.country}</div>
                  <div className="flex justify-center gap-2 text-xs mb-1">
                    <span>{vol.jobs} Jobs</span>
                    <span className="text-muted-foreground">{vol.rate} Rate</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center mb-2">
                    Last contract together:<br />
                    <span className="font-semibold text-black">{vol.lastContract}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors">Rehire</Button>
                </div>
              ))}
            </div>
            <div className="flex items-center h-full">
              <button className="border border-blue-600 text-blue-700 bg-white rounded-full p-2 hover:bg-blue-100 shrink-0 flex items-center justify-center transition-colors" title="Scroll right"><ChevronRight /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationDashboard;
