import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Message } from "../types";
import Avatar from "./Avatar";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => (
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

export default MessageBubble; 