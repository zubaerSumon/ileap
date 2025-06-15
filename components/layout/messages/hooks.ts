import { useState } from "react";
import { trpc } from "@/utils/trpc";
import type { Message } from "./types";
import { useSession } from "next-auth/react";

export const useMessages = (selectedUserId: string | null, isGroup: boolean) => {
  const utils = trpc.useUtils();
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();

  const { data: messages, isLoading: isLoadingMessages, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.messages.getMessages.useInfiniteQuery(
    { 
      userId: selectedUserId || "",
      limit: 20
    },
    { 
      enabled: !!selectedUserId && !isGroup,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 0, // Always consider data stale
      gcTime: 10 * 60 * 1000,
      refetchInterval: false,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
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
      staleTime: 0, // Always consider data stale
      gcTime: 10 * 60 * 1000,
      refetchInterval: false,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await utils.messages.getMessages.cancel({ userId: selectedUserId || "" });

      // Get the current messages
      const previousMessages = utils.messages.getMessages.getData({ userId: selectedUserId || "" });

      // Optimistically update the messages
      if (previousMessages) {
        const optimisticMessage = {
          _id: 'temp-' + Date.now(),
          content: newMessage.content,
          createdAt: new Date().toISOString(),
          isRead: false,
          sender: {
            _id: session?.user?.id || '',
            name: session?.user?.name || '',
            avatar: session?.user?.image || '',
            role: session?.user?.role
          },
          receiver: {
            _id: selectedUserId || '',
            name: '', // Will be populated by the server
            avatar: '', // Will be populated by the server
          },
          __v: 0
        };

        utils.messages.getMessages.setData(
          { userId: selectedUserId || "" },
          (old) => {
            if (!old) return old;
            return {
              messages: [optimisticMessage, ...old.messages],
              nextCursor: old.nextCursor
            };
          }
        );
      }

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        utils.messages.getMessages.setData(
          { userId: selectedUserId || "" },
          context.previousMessages
        );
      }
    },
    onSuccess: () => {
      // Invalidate both conversations and messages
      utils.messages.getConversations.invalidate();
      utils.messages.getMessages.invalidate({ userId: selectedUserId || "" });
      setNewMessage("");
    },
  });

  const sendGroupMessageMutation = trpc.messages.sendGroupMessage.useMutation({
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await utils.messages.getGroupMessages.cancel({ groupId: selectedUserId || "" });

      // Get the current messages
      const previousMessages = utils.messages.getGroupMessages.getData({ groupId: selectedUserId || "" });

      // Optimistically update the messages
      if (previousMessages) {
        const optimisticMessage = {
          _id: 'temp-' + Date.now(),
          content: newMessage.content,
          createdAt: new Date().toISOString(),
          isRead: false,
          sender: {
            _id: session?.user?.id || '',
            name: session?.user?.name || '',
            avatar: session?.user?.image || '',
            role: session?.user?.role
          },
          group: {
            _id: selectedUserId || '',
            name: '', // Will be populated by the server
          },
          __v: 0
        };

        utils.messages.getGroupMessages.setData(
          { groupId: selectedUserId || "" },
          (old) => {
            if (!old) return old;
            return {
              messages: [optimisticMessage, ...old.messages],
              nextCursor: old.nextCursor
            };
          }
        );
      }

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        utils.messages.getGroupMessages.setData(
          { groupId: selectedUserId || "" },
          context.previousMessages
        );
      }
    },
    onSuccess: () => {
      // Invalidate both groups and messages
      utils.messages.getGroups.invalidate();
      utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId || "" });
      setNewMessage("");
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

  const handleLoadMore = async () => {
    if (isGroup) {
      if (hasNextGroupPage) {
        await fetchNextGroupPage();
      }
    } else {
      if (hasNextPage) {
        await fetchNextPage();
      }
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