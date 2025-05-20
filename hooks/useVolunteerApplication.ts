import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";

export const useVolunteerApplication = (opportunityId: string) => {
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Query to check if user has already applied
  const { data: applicationStatus, isPending: isStatusPending } = trpc.applications.getApplicationStatus.useQuery(
    { opportunityId }
  );
  console.log({applicationStatus});

  useEffect(() => {
    if (!isStatusPending) {
      const status = applicationStatus?.status;
      setIsApplied(status === "pending" || status === "approved");
      setIsLoading(false);
    }
  }, [applicationStatus, isStatusPending]);

  // Mutation to apply for opportunity
  const applyMutation = trpc.applications.applyToOpportunity.useMutation({
    onSuccess: () => {
      setIsApplied(true);
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