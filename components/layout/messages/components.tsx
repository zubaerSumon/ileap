import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Menu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export const Avatar = ({ name, avatar, size = 40 }: { name: string; avatar?: string; size?: number }) => {
  const initials = getInitials(name);
  const bgColor = getRandomColor(name);

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden",
      "ring-2 ring-offset-2 ring-offset-white",
      "flex items-center justify-center",
      "font-medium text-white",
      bgColor,
      size === 40 ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs"
    )}>
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export const MessageBubble = ({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) => (
  <div
    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
  >
    {!isOwnMessage && (
      <Avatar name={message.sender.name} avatar={message.sender.avatar} size={32} />
    )}
    <div
      className={cn(
        "max-w-[70%] rounded-lg p-3 ml-2",
        isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100"
      )}
    >
      <p className="break-words">{message.content}</p>
      <p className={cn(
        "text-xs mt-1",
        isOwnMessage ? "text-blue-100" : "text-gray-500"
      )}>
        {format(new Date(message.createdAt), "MMM d, h:mm a")}
      </p>
    </div>
    {isOwnMessage && (
      <Avatar name={message.sender.name} avatar={message.sender.avatar} size={32} />
    )}
  </div>
);

export const MessageInput = React.memo(({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  isSending 
}: { 
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSendMessage} className="w-full">
      <div className="flex items-center h-16 px-4 py-4 border-t">
        <div className="flex-1 flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-10 flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isSending}
            className="h-10"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
});

MessageInput.displayName = 'MessageInput';

export const ConversationHeader = ({ 
  user, 
  onMenuClick,
  isGroup,
  onDeleteGroup
}: { 
  user: { name: string; avatar?: string; members?: number }; 
  onMenuClick: () => void;
  isGroup?: boolean;
  onDeleteGroup?: () => void;
}) => (
  <header className="p-4 border-b flex-shrink-0">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>
        {isGroup ? (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
        ) : (
          <Avatar name={user.name} avatar={user.avatar} />
        )}
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          {isGroup && user.members && (
            <p className="text-xs text-gray-500">{user.members} members</p>
          )}
        </div>
      </div>
      {isGroup && onDeleteGroup && (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDeleteGroup}
        >
          Delete Group
        </Button>
      )}
    </div>
  </header>
); 