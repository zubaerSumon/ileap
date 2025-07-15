'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/layout/shared/EmptyState';
import ActiveContractCard from './ActiveContractCard';
import OpportunityCard from './OpportunityCard';
import { Opportunity } from '@/types/opportunities';
import { OrganisationDashboardTabKey } from '@/utils/constants/organisation-dashboard-tabs';
import { DASHBOARD_GRID_LAYOUT, DASHBOARD_MIN_HEIGHT } from './constants';
import { LucideIcon } from 'lucide-react';

interface ActiveContract {
  id: string;
  profileImg?: string;
  jobTitle: string;
  freelancerName: string;
  startedAt: string;
  opportunityTitle?: string;
  opportunityId?: string;
  uniqueKey: string;
  opportunities: Array<{
    id: string;
    title: string;
  }>;
}

interface TabContentProps {
  tab: OrganisationDashboardTabKey;
  activeContracts: ActiveContract[];
  openOpportunities: Opportunity[];
  archivedOpportunities: Opportunity[];
  currentTabConfig: {
    icon?: LucideIcon;
    emptyState?: {
      title?: string;
      description?: string;
    };
  } | undefined;
  onDeleteOpportunity: (opportunity: Opportunity) => void;
  isLoading: boolean;
}

export const TabContent: React.FC<TabContentProps> = ({
  tab,
  activeContracts,
  openOpportunities,
  archivedOpportunities,
  currentTabConfig,
  onDeleteOpportunity,
  isLoading,
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading opportunities...</p>
      </div>
    );
  }

  if (tab === "active") {
    if (activeContracts.length > 0) {
      return (
        <div className={DASHBOARD_GRID_LAYOUT}>
          {activeContracts.map((contract) => (
            <ActiveContractCard key={contract.uniqueKey} contract={contract} />
          ))}
        </div>
      );
    } else {
      return (
        <EmptyState
          icon={currentTabConfig?.icon}
          title={currentTabConfig?.emptyState?.title || "No active volunteers"}
          description={currentTabConfig?.emptyState?.description || "No active volunteers found."}
          actionLabel="Find Volunteers"
          onAction={() => router.push("/find-volunteer")}
          variant="card"
          className={DASHBOARD_MIN_HEIGHT}
        />
      );
    }
  }

  // For open and archived tabs
  const opportunities = tab === "open" ? openOpportunities : archivedOpportunities;
  
  if (opportunities.length > 0) {
    return (
      <div className={DASHBOARD_GRID_LAYOUT}>
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity._id}
            opportunity={opportunity}
            tab={tab}
            onDelete={onDeleteOpportunity}
          />
        ))}
      </div>
    );
  } else {
          return (
        <EmptyState
          icon={currentTabConfig?.icon}
          title={currentTabConfig?.emptyState?.title || "No items found"}
          description={currentTabConfig?.emptyState?.description || "No items available."}
          actionLabel={tab === "open" ? "Create Opportunity" : "View All Opportunities"}
          onAction={() => router.push(tab === "open" ? "/organisation/opportunities/create" : "/organisation/opportunities")}
          variant="card"
          className={DASHBOARD_MIN_HEIGHT}
        />
      );
  }
};

export default TabContent; 