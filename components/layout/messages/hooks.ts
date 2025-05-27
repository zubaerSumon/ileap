import { useState } from "react";
import { trpc } from "@/utils/trpc";
import type { Message } from "./types";
import { useSession } from "next-auth/react";

export const useMessages = (selectedUserId: string | null, isGroup: boolean) => {
  const utils = trpc.useUtils();
  const [newMessage, setNewMessage] = useState("");

  const { data: messages, isLoading: isLoadingMessages, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.messages.getMessages.useInfiniteQuery(
    { 
      userId: selectedUserId || "",
      limit: 20
    },
    { 
      enabled: !!selectedUserId && !isGroup,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5000,
    }
  );

  const { data: groupMessages, isLoading: isLoadingGroupMessages, fetchNextPage: fetchNextGroupPage, hasNextPage: hasNextGroupPage, isFetchingNextPage: isFetchingNextGroupPage } = trpc.messages.getGroupMessages.useInfiniteQuery(
    { 
      groupId: selectedUserId || "",
      limit: 20
    },
    { 
      enabled: !!selectedUserId && isGroup,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5000,
    }
  );

  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      utils.messages.getMessages.invalidate({ userId: selectedUserId || "" });
      utils.messages.getConversations.invalidate();
      setNewMessage("");
      setTimeout(() => {
        const messagesEnd = document.querySelector('[data-messages-end]');
        messagesEnd?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  const sendGroupMessageMutation = trpc.messages.sendGroupMessage.useMutation({
    onSuccess: () => {
      utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId || "" });
      utils.messages.getGroups.invalidate();
      setNewMessage("");
      setTimeout(() => {
        const messagesEnd = document.querySelector('[data-messages-end]');
        messagesEnd?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    if (isGroup) {
      sendGroupMessageMutation.mutate({
        groupId: selectedUserId,
        content: newMessage,
      });
    } else {
      sendMessageMutation.mutate({
        receiverId: selectedUserId,
        content: newMessage,
      });
    }
  };

  const handleLoadMore = () => {
    if (isGroup) {
      fetchNextGroupPage();
    } else {
      fetchNextPage();
    }
  };

  const flattenedMessages = isGroup 
    ? groupMessages?.pages.flatMap(page => (page.messages as unknown) as Message[]) 
    : messages?.pages.flatMap(page => (page.messages as unknown) as Message[]);

  return {
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleLoadMore,
    flattenedMessages,
    isLoadingMessages: isGroup ? isLoadingGroupMessages : isLoadingMessages,
    hasMore: isGroup ? hasNextGroupPage : hasNextPage,
    isLoadingMore: isGroup ? isFetchingNextGroupPage : isFetchingNextPage,
    isSending: isGroup ? sendGroupMessageMutation.isPending : sendMessageMutation.isPending,
  };
};

export const useConversations = () => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  const { data: conversations, isLoading: isLoadingConversations } = trpc.messages.getConversations.useQuery(undefined, {
    enabled: !!session,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 5000,
  });

  const { data: groups, isLoading: isLoadingGroups } = trpc.messages.getGroups.useQuery(undefined, {
    enabled: !!session,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 5000,
  });

  const markAsReadMutation = trpc.messages.markAsRead.useMutation({
    onSuccess: () => {
      utils.messages.getConversations.invalidate();
      utils.messages.getGroups.invalidate();
    },
  });

  return {
    conversations,
    groups,
    isLoadingConversations,
    isLoadingGroups,
    markAsReadMutation,
  };
}; 