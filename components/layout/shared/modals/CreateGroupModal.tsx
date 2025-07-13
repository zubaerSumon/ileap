"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (groupId: string) => void;
}

export function CreateGroupModal({
  isOpen,
  onClose,
  onGroupCreated,
}: CreateGroupModalProps) {
  const utils = trpc.useUtils();

  const createGroupMutation = trpc.messages.createGroup.useMutation({
    onSuccess: (data) => {
      toast.success("Group created successfully!");
      onGroupCreated(data._id);
      utils.messages.getGroups.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create group");
    },
  });

  const handleConfirmCreateGroup = () => {
    // This will be handled by the parent component that has access to the actual data
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Create a group with all the recruited volunteers for this
            opportunity?
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCreateGroup}
              disabled={createGroupMutation.isPending}
              className="w-full sm:w-auto"
            >
              {createGroupMutation.isPending ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 