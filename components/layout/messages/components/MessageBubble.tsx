import React from "react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";
import Avatar from "./Avatar";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const formatMessageDate = (date: Date): string => {
  const now = new Date();
  const diffDays = differenceInDays(now, date);

  if (diffDays === 0) {
    return format(date, "h:mm a");
  } else {
    return `${diffDays} days ago`;
  }
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => (
  <div
    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
  >
    {!isOwnMessage && message.sender && (
      <Avatar name={message.sender.name || ''} avatar={message.sender.avatar} size={32} />
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
        {formatMessageDate(new Date(message.createdAt))}
      </p>
    </div>
    {isOwnMessage && message.sender && (
      <Avatar name={message.sender.name || ''} avatar={message.sender.avatar} size={32} />
    )}
  </div>
);

export default MessageBubble; 