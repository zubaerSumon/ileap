'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NewMessageModalProps {
  onClose: () => void;
  onSend: (userId: string, message: string) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ onClose, onSend }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Query users based on role
  const { data: users } = trpc.users.getAvailableUsers.useQuery();

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && message.trim()) {
      onSend(selectedUserId, message);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-64">
            {filteredUsers?.map((user) => (
              <Card
                key={user._id}
                className={`mb-2 cursor-pointer ${selectedUserId === user._id ? 'bg-gray-50' : ''}`}
                onClick={() => setSelectedUserId(user._id)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <Image
                    src={user.avatar || '/avatar.svg'}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>

          <div>
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedUserId || !message.trim()}>
              Send
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;