import React, { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import ConversationHeader from "./ConversationHeader";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Message, Conversation, Group } from "@/types/message";

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
  currentUserId: string;
  isSending: boolean;
  selectedConversationId: string | null;
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
  isLoadingMore,
  isSending,
  selectedConversationId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReachedTop, setHasReachedTop] = useState(false);
  const shouldScrollRef = useRef(false);
  const previousMessageCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (!topRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading && !hasReachedTop) {
          setIsLoading(true);
          onLoadMore();
          // Reset loading state after a minimum time to prevent flickering
          setTimeout(() => {
            setIsLoading(false);
            // If we've loaded all messages, set hasReachedTop to true
            if (!hasMore) {
              setHasReachedTop(true);
            }
          }, 1000);
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

  // Reset hasReachedTop when conversation changes
  useEffect(() => {
    setHasReachedTop(false);
    isInitialLoadRef.current = true;
  }, [selectedConversation?._id]);

  // Set shouldScroll to true when a conversation is selected
  useEffect(() => {
    shouldScrollRef.current = true;
  }, [selectedConversationId]);

  // Scroll to bottom when new messages arrive or when sending
  useEffect(() => {
    const scrollToBottom = () => {
      const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    };

    const currentMessageCount = messages?.length || 0;
    const previousMessageCount = previousMessageCountRef.current;

    // Scroll on initial load
    if (isInitialLoadRef.current && messages && messages.length > 0 && !isLoadingMessages) {
      scrollToBottom();
      isInitialLoadRef.current = false;
    }

    // Only scroll to bottom if:
    // 1. We're sending a new message, OR
    // 2. New messages were added to the end (not older messages loaded at top)
    const hasNewMessagesAtEnd = currentMessageCount > previousMessageCount && 
      shouldScrollRef.current && 
      !isLoadingMore;

    if (isSending || hasNewMessagesAtEnd) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }

    // Update the previous message count
    previousMessageCountRef.current = currentMessageCount;
  }, [messages, isSending, selectedConversationId, isLoadingMessages, isLoadingMore]);

  const headerData = isGroup ? {
    name: (selectedConversation as Group)?.name,
    members: (selectedConversation as Group)?.members?.length,
    avatar: (selectedConversation as Group)?.avatar
  } : selectedConversation && 'user' in selectedConversation ? {
    name: selectedConversation.user.name,
    avatar: selectedConversation.user.avatar
  } : undefined;

  // Sort messages by creation time in ascending order and remove duplicates
  const sortedMessages = React.useMemo(() => {
    if (!messages) return [];
    const uniqueMessages = Array.from(new Map(messages.map(msg => [msg._id, msg])).values());
    return uniqueMessages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col border">
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          {isGroup ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {(selectedConversation as Group)?.name.length > 15 
                  ? `${(selectedConversation as Group)?.name.substring(0, 15)}...` 
                  : (selectedConversation as Group)?.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{(selectedConversation as Group)?.members?.length} members</p>
              <p className="text-sm text-gray-500">Start the conversation by sending a message</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No messages yet</p>
          )}
        </div>
      </div>
    );
  }

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

      <div className="flex-1 min-h-0 max-h-[800px]">
        <ScrollArea ref={scrollAreaRef} className="h-[580px]">
          <div className="space-y-4 px-4 py-4 pb-8">
            {hasMore && !hasReachedTop && (
              <div ref={topRef} className="text-center">
                {isLoadingMore || isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more messages...
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsLoading(true);
                      onLoadMore();
                      setTimeout(() => setIsLoading(false), 1000);
                    }}
                    disabled={isLoadingMore}
                  >
                    Load more messages
                  </Button>
                )}
              </div>
            )}
            {(!hasMore || hasReachedTop) && messages.length > 0 && !isLoadingMore && !isLoading && (
              <div className="text-center text-sm text-muted-foreground py-2">
                Beginning of conversation
              </div>
            )}
            {sortedMessages.map((message: Message, index) => (
              <div
                key={`${message._id}-${index}`}
                ref={index === sortedMessages.length - 1 ? lastMessageRef : null}
              >
                <MessageBubble
                  message={message}
                  isOwnMessage={message.sender?._id === session?.user?.id}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

export default ChatArea;