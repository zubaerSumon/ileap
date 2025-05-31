import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Opportunity } from "@/types/opportunities";

interface OpenContentProps {
  openOpportunities: Opportunity[];
  isLoadingOpportunities: boolean;
  router: ReturnType<typeof useRouter>;
}

const OpenContent = ({ openOpportunities, isLoadingOpportunities, router }: OpenContentProps) => (
  <div className="space-y-0.5 mb-8">
    {isLoadingOpportunities ? (
      <Skeleton className="h-24 w-full" />
    ) : openOpportunities.length === 0 ? (
      <div className="text-muted-foreground">No open opportunities.</div>
    ) : (
      openOpportunities.map((opportunity) => (
        <div
          key={opportunity._id}
          className="bg-white border-b border-gray-200 flex flex-row items-center justify-between px-6 h-24 last:border-b-0"
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base truncate">
              {opportunity.title}
            </div>
            <div className="text-xs text-muted-foreground">
              Posted {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
            </div>
          </div>
          <div className="flex gap-2 ml-4 items-center">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors"
              onClick={() => router.push(`/organization/opportunities/${opportunity._id}/applications`)}
            >
              View Applicants
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors"
              onClick={() => router.push(`/organization/opportunities/${opportunity._id}/edit`)}
            >
              Edit Opportunity
            </Button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default OpenContent; 