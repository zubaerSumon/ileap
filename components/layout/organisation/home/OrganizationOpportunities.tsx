import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PlusIcon, Trash2, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/utils/trpc";
import { Opportunity } from "@/types/opportunities";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type TabType = "active" | "archived";

interface OpportunityWithCounts extends Opportunity {
  applicantCount?: number;
  recruitCount?: number;
}

export default function OrganizationOpportunities() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [opportunityToDelete, setOpportunityToDelete] = useState<OpportunityWithCounts | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: opportunities, isLoading: isLoadingOpportunities } =
    trpc.opportunities.getOrganizationOpportunities.useQuery();

  const utils = trpc.useUtils();
  const archiveMutation = trpc.opportunities.archiveOpportunity.useMutation({
    onSuccess: () => {
      utils.opportunities.getOrganizationOpportunities.invalidate();
    },
  });

  const deleteMutation = trpc.opportunities.deleteOpportunity.useMutation({
    onSuccess: () => {
      utils.opportunities.getOrganizationOpportunities.invalidate();
    },
  });

  const handleArchive = async (opportunity: OpportunityWithCounts) => {
    try {
      await archiveMutation.mutateAsync(opportunity._id);
    } catch (error) {
      console.error("Failed to archive opportunity:", error);
    }
  };

  const handleDelete = async (opportunity: OpportunityWithCounts) => {
    try {
      await deleteMutation.mutateAsync(opportunity._id);
      setIsDeleteDialogOpen(false);
      setOpportunityToDelete(null);
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
    }
  };

  const filteredOpportunities = opportunities?.filter((opp) => {
    if (activeTab === "active") {
      return !opp.is_archived;
    }
    return opp.is_archived;
  });

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Opportunities</h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center w-full md:w-auto"
          size="lg"
          onClick={() => router.push("/organization/opportunities/create")}
        >
          <PlusIcon className="mr-2 transform scale-170" />
          Post an opportunity
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "active" ? "default" : "outline"}
          onClick={() => setActiveTab("active")}
          className={`min-w-[100px] ${
            activeTab === "active"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Active
        </Button>
        <Button
          variant={activeTab === "archived" ? "default" : "outline"}
          onClick={() => setActiveTab("archived")}
          className={`min-w-[100px] ${
            activeTab === "archived"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Archived
        </Button>
      </div>

      {isLoadingOpportunities ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      ) : filteredOpportunities?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            {activeTab === "active"
              ? "You haven't posted any opportunities yet."
              : "No archived opportunities."}
          </p>
          {activeTab === "active" && (
            <p className="text-gray-500 text-sm mt-2">
              Click the button above to create your first opportunity.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities?.map((opportunity) => (
            <div
              key={opportunity._id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative h-[340px]"
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3">
                      <Image
                        src={opportunity?.organization_profile?.profile_img || "/default-org-logo.svg"}
                        alt={opportunity?.organization_profile?.name || "Organization Logo"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <h3 
                      className="text-lg font-semibold cursor-pointer hover:text-blue-600"
                      onClick={() => router.push(`/organization/opportunities/${opportunity._id}`)}
                    >
                      {opportunity.title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpportunityToDelete(opportunity);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  <span>{opportunity.location}</span>
                  <Badge variant="outline" className="ml-2 px-2 py-0.5 text-xs">
                    {opportunity.commitment_type === 'oneoff' ? 'One-off' : 'Regular'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {opportunity.category.map((cat: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="flex-1">
                  <div 
                    className="text-sm text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: opportunity.description
                    }}
                  />
                </div>

                <div className="mt-auto pt-4">
                  <div className="text-xs text-gray-500 mb-4">
                    Posted {formatDistanceToNow(opportunity.createdAt, { addSuffix: true })}
                  </div>

                  <div className="flex justify-between items-center">
                   
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {activeTab === "active"
                ? "This will move the opportunity to the archive. You can delete it permanently from there."
                : "This action cannot be undone. This will permanently delete the opportunity."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (opportunityToDelete) {
                  if (activeTab === "active") {
                    handleArchive(opportunityToDelete);
                  } else {
                    handleDelete(opportunityToDelete);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {activeTab === "active" ? "Archive" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 