import { Button } from "@/components/ui/button";
import { useVolunteerApplication } from "@/hooks/useVolunteerApplication";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { OpportunityDetails } from "@/components/layout/volunteer/home-page/HomePageCategories";
import { cn } from "@/lib/utils";

interface ApplyButtonProps {
  opportunityId: string;
  opportunityDetails: OpportunityDetails;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  opportunityDate?: {
    start_date?: Date;
    end_date?: Date;
  };
}

export function ApplyButton({
  opportunityId,
  opportunityDetails,
  className = "bg-blue-600 hover:bg-blue-700 h-8 px-5 font-normal text-sm text-white cursor-pointer",
  variant = "default",
  size = "default",
  opportunityDate,
}: ApplyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isApplied, isLoading, isApplying } = useVolunteerApplication(opportunityId);

  // Check if opportunity has ended
  const isOpportunityEnded = useMemo(() => {
    if (!opportunityDate) return false;
    
    const now = new Date();
    const opportunityEndDate = opportunityDate.end_date || opportunityDate.start_date;
    
    return opportunityEndDate ? new Date(opportunityEndDate) < now : false;
  }, [opportunityDate]);

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (isApplied) {
    return (
      <Button
        variant="secondary"
        size={size}
        className={cn(className, "bg-green-600 hover:bg-green-700")}
        disabled
      >
        Applied
      </Button>
    );
  }

  if (isOpportunityEnded) {
    return (
      <Button
        variant="secondary"
        size={size}
        className={cn(className, "bg-gray-400 hover:bg-gray-400 cursor-not-allowed")}
        disabled
      >
        Ended
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
        disabled={isApplying}
      >
        {isApplying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Applying...
          </>
        ) : (
          "Apply Now"
        )}
      </Button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        opportunityDetails={opportunityDetails}
      />
    </>
  );
} 