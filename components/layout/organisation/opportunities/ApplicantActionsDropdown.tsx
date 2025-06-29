"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Loader2, UserPlus } from "lucide-react";

interface ApplicantActionsDropdownProps {
  isMentorForOpportunity: boolean;
  isMarkingAsMentor: boolean;
  onMarkAsMentor: () => void;
}

export function ApplicantActionsDropdown({
  isMentorForOpportunity,
  isMarkingAsMentor,
  onMarkAsMentor,
}: ApplicantActionsDropdownProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsMentor();
            }}
            disabled={isMarkingAsMentor || isMentorForOpportunity}
          >
            {isMarkingAsMentor ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Marking...
              </div>
            ) : isMentorForOpportunity ? (
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Already Mentor
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Mark as Mentor
              </div>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 