import React from "react";
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

  const handleViewApplication = () => {
    router.push(`/organisation/opportunities/${opportunityId}`);
  };

  const handleEdit = () => {
     console.log("Edit opportunity:", opportunityId);
  };

  const handleDelete = () => {
     console.log("Delete opportunity:", opportunityId);
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "";

  return (
    <DropdownMenu>
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
        {activeTab !== "archived" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
