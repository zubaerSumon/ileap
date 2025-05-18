'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


interface NewMessageModalProps {
  currentUser: {
    name: string;
    avatar: string;
    location?: string;
  };
  onClose: () => void;
  onSend: (recipient: string, message: string) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ onClose, onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !message.trim()) return;
    
    onSend(recipient, message);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <div className="flex-grow">
            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Send
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;