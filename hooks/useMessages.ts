import { Message } from "@/types/message";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
        refetchInterval: 3000, // Poll every 3 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      }
    );
  
    const { data: groupMessages, isLoading: isLoadingGroupMessages, fetchNextPage: fetchNextGroupPage, hasNextPage: hasNextGroupPage, isFetchingNextPage: isFetchingNextGroupNextPage } = trpc.messages.getGroupMessages.useInfiniteQuery(
      { 
        groupId: selectedUserId || "",
        limit: 20
      },
      { 
        enabled: !!selectedUserId && isGroup,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchInterval: 3000, // Poll every 3 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      }
    );
  
    const sendMessageMutation = trpc.messages.sendMessage.useMutation({
      onMutate: async (newMessage) => {
        console.log('🚀 Starting optimistic update for message:', newMessage.content);
        
        // Cancel any outgoing refetches
        await utils.messages.getMessages.cancel({ userId: selectedUserId || "" });

        // Get the current messages
        const previousMessages = utils.messages.getMessages.getInfiniteData({ userId: selectedUserId || "", limit: 20 });
        console.log('📝 Previous messages data:', previousMessages);

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

          console.log('📝 Adding optimistic message:', optimisticMessage);

          utils.messages.getMessages.setInfiniteData(
            { userId: selectedUserId || "", limit: 20 },
            (oldData) => {
              if (!oldData) {
                console.log('❌ No old data for optimistic update');
                return oldData;
              }
              
              console.log('📝 Optimistic update - old pages count:', oldData.pages.length);
              const newPages = [...oldData.pages];
              if (newPages.length > 0) {
                // Add the optimistic message to the end of the first page
                // The ChatArea component will sort messages by creation time
                newPages[0] = {
                  ...newPages[0],
                  messages: [...newPages[0].messages, optimisticMessage],
                };
              }
              
              console.log('📝 Optimistic update - new first page messages count:', newPages[0]?.messages?.length || 0);
              return {
                ...oldData,
                pages: newPages,
              };
            }
          );
        } else {
          console.log('❌ No previous messages found for optimistic update');
        }

        return { previousMessages };
      },
      onError: (err, newMessage, context) => {
        // Rollback on error
        if (context?.previousMessages) {
          utils.messages.getMessages.setInfiniteData(
            { userId: selectedUserId || "", limit: 20 },
            context.previousMessages
          );
        }
      },
      onSuccess: (data) => {
        console.log('✅ Message sent successfully:', data);
        // Invalidate conversations to update the list
        utils.messages.getConversations.invalidate();
        setNewMessage("");
      },
    });
  
    const sendGroupMessageMutation = trpc.messages.sendGroupMessage.useMutation({
      onMutate: async (newMessage) => {
        console.log('🚀 Starting optimistic update for group message:', newMessage.content);
        
        // Cancel any outgoing refetches
        await utils.messages.getGroupMessages.cancel({ groupId: selectedUserId || "" });

        // Get the current messages
        const previousMessages = utils.messages.getGroupMessages.getInfiniteData({ groupId: selectedUserId || "", limit: 20 });
        console.log('📝 Previous group messages data:', previousMessages);

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

          console.log('📝 Adding optimistic group message:', optimisticMessage);

          utils.messages.getGroupMessages.setInfiniteData(
            { groupId: selectedUserId || "", limit: 20 },
            (oldData) => {
              if (!oldData) {
                console.log('❌ No old data for optimistic group update');
                return oldData;
              }
              
              console.log('📝 Optimistic group update - old pages count:', oldData.pages.length);
              const newPages = [...oldData.pages];
              if (newPages.length > 0) {
                // Add the optimistic message to the end of the first page
                // The ChatArea component will sort messages by creation time
                newPages[0] = {
                  ...newPages[0],
                  messages: [...newPages[0].messages, optimisticMessage],
                };
              }
              
              console.log('📝 Optimistic group update - new first page messages count:', newPages[0]?.messages?.length || 0);
              return {
                ...oldData,
                pages: newPages,
              };
            }
          );
        } else {
          console.log('❌ No previous group messages found for optimistic update');
        }

        return { previousMessages };
      },
      onError: (err, newMessage, context) => {
        // Rollback on error
        if (context?.previousMessages) {
          utils.messages.getGroupMessages.setInfiniteData(
            { groupId: selectedUserId || "", limit: 20 },
            context.previousMessages
          );
        }
      },
      onSuccess: () => {
        // Invalidate conversations to update the list
        utils.messages.getConversations.invalidate();
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
      isLoadingMore: isGroup ? isFetchingNextGroupNextPage : isFetchingNextPage,
      isSending: isGroup ? sendGroupMessageMutation.isPending : sendMessageMutation.isPending,
    };
  };
  