import { trpc } from "@/utils/trpc";
import { useState, useEffect, useMemo } from "react";

export const useVolunteerApplication = (opportunityId: string) => {
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const utils = trpc.useUtils();

  // Query to check if user has already applied
  const { data: applicationStatus, isPending: isStatusPending } = trpc.applications.getApplicationStatus.useQuery(
    { opportunityId }
  );

  // Memoize the application state to prevent unnecessary re-renders
  const applicationState = useMemo(() => {
    if (isStatusPending) {
      return { isApplied: false, isLoading: true };
    }
    
    const status = applicationStatus?.status;
    return {
      isApplied: status === "pending" || status === "approved",
      isLoading: false,
    };
  }, [applicationStatus, isStatusPending]);

  useEffect(() => {
    setIsApplied(applicationState.isApplied);
    setIsLoading(applicationState.isLoading);
  }, [applicationState]);

  // Mutation to apply for opportunity
  const applyMutation = trpc.applications.applyToOpportunity.useMutation({
    onSuccess: () => {
      setIsApplied(true);
      // Invalidate all application-related queries to update dashboard tabs
      utils.applications.getApplicationStatus.invalidate();
      utils.applications.getCurrentUserActiveApplicationsCount.invalidate();
      utils.applications.getCurrentUserRecentApplicationsCount.invalidate();
      utils.applications.getCurrentUserActiveApplications.invalidate();
      utils.applications.getCurrentUserRecentApplications.invalidate();
      // Invalidate opportunities to update recruit counts
      utils.opportunities.getAllOpportunities.invalidate();
    },
  });

  const handleApply = () => {
    applyMutation.mutate({ opportunityId });
  };

  return {
    isApplied,
    isLoading,
    isApplying: applyMutation.isPending,
    handleApply,
  };
}; 