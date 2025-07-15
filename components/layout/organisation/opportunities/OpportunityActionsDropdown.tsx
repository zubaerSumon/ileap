import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "@/components/modals/ConfirmationDialog";

interface OpportunityActionsDropdownProps {
  opportunityId: string;
  activeTab: string;
  size?: "sm" | "default";
  className?: string;
}

export default function OpportunityActionsDropdown({
  opportunityId,
  activeTab,
  size = "default",
  className = "",
}: OpportunityActionsDropdownProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const utils = trpc.useUtils();
  
  const deleteMutation = trpc.opportunities.deleteOpportunity.useMutation({
    onSuccess: () => {
      utils.opportunities.getOrganizationOpportunities.invalidate();
      setIsDeleteDialogOpen(false);
      toast.success("Opportunity deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete opportunity:", error);
      toast.error(error.message || "Failed to delete opportunity");
      setIsDeleteDialogOpen(false);
    },
  });

  const archiveMutation = trpc.opportunities.archiveOpportunity.useMutation({
    onSuccess: () => {
      utils.opportunities.getOrganizationOpportunities.invalidate();
      setIsDeleteDialogOpen(false);
      toast.success("Opportunity archived successfully");
    },
    onError: (error) => {
      console.error("Failed to archive opportunity:", error);
      toast.error(error.message || "Failed to archive opportunity");
      setIsDeleteDialogOpen(false);
    },
  });

  const handleViewApplication = () => {
    setIsDropdownOpen(false);
    router.push(`/organisation/opportunities/${opportunityId}`);
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    console.log("Edit opportunity:", opportunityId);
  };

  const handleDelete = () => {
    setIsDropdownOpen(false); // Close dropdown when opening confirmation dialog
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (activeTab === "archived") {
      deleteMutation.mutate(opportunityId);
    } else {
      archiveMutation.mutate(opportunityId);
    }
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "";

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`cursor-pointer ${buttonSize} ${className}`}
          >
            <MoreHorizontal className={iconSize} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewApplication}>
            View Application
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            {activeTab === "archived" ? "Delete" : "Archive"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure?"
        description={
          activeTab === "archived"
            ? "This action cannot be undone. This will permanently delete the opportunity."
            : "This will move the opportunity to the archive. You can delete it permanently from there."
        }
        confirmText={activeTab === "archived" ? "Delete" : "Archive"}
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={archiveMutation.isPending || deleteMutation.isPending}
      />
    </>
  );
}
