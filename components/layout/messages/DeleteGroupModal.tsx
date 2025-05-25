'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteGroupModalProps {
  groupName: string;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  groupName,
  onClose,
  onDelete,
}) => {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Delete Group</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the group &quot;{groupName}&quot;? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="destructive"
              onClick={onDelete}
            >
              Delete Group
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGroupModal;