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
    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3 sm:mb-4`}
  >
    {!isOwnMessage && message.sender && (
      <div className="flex-shrink-0 mr-2 sm:mr-3">
        <Avatar name={message.sender.name || ''} avatar={message.sender.avatar} size={28} />
      </div>
    )}
    <div
      className={cn(
        "max-w-[75%] sm:max-w-[70%] rounded-lg p-2.5 sm:p-3",
        isOwnMessage 
          ? "bg-blue-500 text-white ml-2 sm:ml-3" 
          : "bg-gray-100 text-gray-900"
      )}
    >
      <p className="break-words text-sm sm:text-base leading-relaxed">{message.content}</p>
      <p className={cn(
        "text-xs mt-1.5 sm:mt-1",
        isOwnMessage ? "text-blue-100" : "text-gray-500"
      )}>
        {formatMessageDate(new Date(message.createdAt))}
      </p>
    </div>
    {isOwnMessage && message.sender && (
      <div className="flex-shrink-0 ml-2 sm:ml-3">
        <Avatar name={message.sender.name || ''} avatar={message.sender.avatar} size={28} />
      </div>
    )}
  </div>
);

export default MessageBubble; 