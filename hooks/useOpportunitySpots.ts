import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';

type Opportunity = {
  id: string;
  totalSpots: number;
  spotsAvailable: number;
};

/**
 * Custom hook to track available spots for opportunities based on applied events
 * @returns Object containing calculated spots available for each opportunity
 */
export function useOpportunitySpots(opportunities: Opportunity[]) {
  const [opportunitiesWithSpots, setOpportunitiesWithSpots] = useState<Opportunity[]>([]);

  // Fetch volunteers who have applied to events
  const { data: volunteersData } = trpc.volunteers.getVolunteersWithAppliedEvents.useQuery(
    { eventId: '' }, // Empty string to get all volunteers with applied events
    { enabled: true }
  );

  useEffect(() => {
    if (!opportunities || !volunteersData) return;

    // Create a map to count applications for each opportunity
    const applicationCounts: Record<string, number> = {};
    
    // Count applications for each opportunity ID
    volunteersData.forEach(volunteer => {
      if (volunteer.applied_events && Array.isArray(volunteer.applied_events)) {
        volunteer.applied_events.forEach(eventId => {
          applicationCounts[eventId] = (applicationCounts[eventId] || 0) + 1;
        });
      }
    });

    // Update opportunities with calculated spots available
    const updatedOpportunities = opportunities.map(opportunity => {
      const appliedCount = applicationCounts[opportunity.id] || 0;
      const spotsAvailable = Math.max(0, opportunity.totalSpots - appliedCount);
      
      return {
        ...opportunity,
        spotsAvailable
      };
    });

    setOpportunitiesWithSpots(updatedOpportunities);
  }, [opportunities, volunteersData]);

  return opportunitiesWithSpots;
}