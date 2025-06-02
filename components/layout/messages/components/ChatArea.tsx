import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message, Conversation, Group } from "../types";
import MessageBubble from "./MessageBubble";
import ConversationHeader from "./ConversationHeader";

interface ChatAreaProps {
  messages: Message[] | undefined;
  isLoadingMessages: boolean;
  selectedConversation: Conversation | Group | undefined;
  onMenuClick: () => void;
  session: { user?: { id?: string } } | null;
  isGroup?: boolean;
  onDeleteGroup?: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = React.memo(({ 
  messages, 
  isLoadingMessages,
  selectedConversation,
  onMenuClick,
  session,
  isGroup,
  onDeleteGroup,
  onLoadMore,
  hasMore,
  isLoadingMore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!topRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(topRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  const headerData = isGroup ? {
    name: (selectedConversation as Group)?.name,
    members: (selectedConversation as Group)?.members?.length
  } : selectedConversation && 'user' in selectedConversation ? {
    name: selectedConversation.user.name,
    avatar: selectedConversation.user.avatar
  } : undefined;

  return (
    <div className="flex flex-col h-full">
      {selectedConversation && headerData && (
        <ConversationHeader 
          user={headerData}
          onMenuClick={onMenuClick}
          isGroup={isGroup}
          onDeleteGroup={onDeleteGroup}
        />
      )}

      <div className="flex-1 min-h-[400px] max-h-[calc(100vh-16rem)]">
        <ScrollArea className="h-full">
          <div className="p-4">
            {isLoadingMessages ? (
              <div className="text-center text-gray-500">Loading messages...</div>
            ) : !messages || messages.length === 0 ? (
              <div className="text-center text-gray-500">No messages yet</div>
            ) : (
              <div className="space-y-4">
                {hasMore && (
                  <div ref={topRef} className="text-center">
                    {isLoadingMore ? (
                      <div className="text-gray-500">Loading more messages...</div>
                    ) : (
                      <button 
                        onClick={onLoadMore}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Load more messages
                      </button>
                    )}
                  </div>
                )}
                {messages.map((message: Message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwnMessage={message.sender?._id === session?.user?.id}
                  />
                ))}
                <div ref={messagesEndRef} data-messages-end />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

export default ChatArea;