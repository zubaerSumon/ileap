import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export const useConversations = () => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initial load of conversations and groups
  const { data: conversations, isLoading: isLoadingConversations } =
    trpc.messages.getConversations.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: 5000, // Poll every 5 seconds for new conversations
    });

  const { data: groups, isLoading: isLoadingGroups } =
    trpc.messages.getGroups.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: 5000, // Poll every 5 seconds for new groups
    });

  // Real-time updates using EventSource
  useEffect(() => {
    if (!session?.user?.id) return;

    console.log('📡 Connecting to EventSource for conversations');

    // Create EventSource connection
    const eventSource = new EventSource('/api/messages/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ EventSource connection opened for conversations');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Received EventSource conversation update:', data);
        
        if (data.type === 'new_message' || data.type === 'message_read') {
          console.log('🔄 Updating conversations due to message event');
          // Invalidate conversations and groups to update the sidebar
          utils.messages.getConversations.invalidate();
          utils.messages.getGroups.invalidate();
        }
      } catch (error) {
        console.error('Error parsing EventSource message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource connection error:', error);
    };

    return () => {
      console.log('📡 Closing EventSource connection for conversations');
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [session?.user?.id, utils]);

  console.log('🔍 useConversations hook state:', {
    sessionUserId: session?.user?.id,
    conversationsCount: conversations?.length || 0,
    groupsCount: groups?.length || 0,
    isLoadingConversations,
    isLoadingGroups,
    conversationsData: conversations?.slice(0, 2).map(c => ({ id: c._id, lastMessage: c.lastMessage?.content?.substring(0, 20) })),
    groupsData: groups?.slice(0, 2).map(g => ({ id: g._id, lastMessage: g.lastMessage?.content?.substring(0, 20) }))
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
