'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConversationModalProps {
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteConversationModal: React.FC<DeleteConversationModalProps> = ({
  onClose,
  onDelete,
}) => {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this conversation?</p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="default"
              onClick={onDelete}
            >
              Delete
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

export default DeleteConversationModal;