import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

export const useConversations = () => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  // Initial load of conversations and groups
  const { data: conversations, isLoading: isLoadingConversations } =
    trpc.messages.getConversations.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: false, // Disable automatic refetching
    });

  const { data: groups, isLoading: isLoadingGroups } =
    trpc.messages.getGroups.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: false, // Disable automatic refetching
    });

  // SSE subscription for conversations
  const subscription = trpc.messages.subscribeToConversations.useSubscription(
    undefined,
    {
      enabled: !!session?.user?.id,
      onData: (data) => {
        console.log('📡 SSE: Received conversation update:', data);
        
        if (data.type === 'conversation_update') {
          console.log('🔄 SSE: Updating conversations');
          utils.messages.getConversations.invalidate();
        }
        
        if (data.type === 'group_update') {
          console.log('🔄 SSE: Updating groups');
          utils.messages.getGroups.invalidate();
        }
      },
      onError: (error) => {
        console.error('📡 SSE: Conversation subscription error:', error);
      },
    }
  );

  console.log('🔍 useConversations hook state:', {
    sessionUserId: session?.user?.id,
    conversationsCount: conversations?.length || 0,
    groupsCount: groups?.length || 0,
    isLoadingConversations,
    isLoadingGroups,
    conversationsData: conversations?.slice(0, 2).map(c => ({ id: c._id, lastMessage: c.lastMessage?.content?.substring(0, 20) })),
    groupsData: groups?.slice(0, 2).map(g => ({ id: g._id, lastMessage: g.lastMessage?.content?.substring(0, 20) })),
    subscriptionStatus: subscription.status
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
