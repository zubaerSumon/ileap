import { Skeleton } from "@/components/ui/skeleton";
import ActiveContractCard from "./ActiveContractCard";

interface ActiveContract {
  id: string;
  profileImg?: string;
  jobTitle: string;
  freelancerName: string;
}

interface ActiveContentProps {
  activeContracts: ActiveContract[];
  isLoadingRecruited: boolean;
}

const ActiveContent = ({ activeContracts, isLoadingRecruited }: ActiveContentProps) => (
  <div className="space-y-0.5 mb-8">
    {isLoadingRecruited ? (
      <Skeleton className="h-28 w-full" />
    ) : activeContracts.length === 0 ? (
      <div className="text-muted-foreground">No active volunteer contracts.</div>
    ) : (
      activeContracts.map((contract) => (
        <ActiveContractCard
          key={contract.id}
          avatar={contract.profileImg || "/avatar.svg"}
          jobTitle={contract.jobTitle}
          freelancerName={contract.freelancerName}
          onFundMilestone={() => {}}
          onMessage={() => {}}
        />
      ))
    )}
  </div>
);

export default ActiveContent; 