import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

export const useConversations = () => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  // Initial load of conversations and groups with polling
  const { data: conversations, isLoading: isLoadingConversations } =
    trpc.messages.getConversations.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: 30000, // Poll every 30 seconds for new conversations
    });

  const { data: groups, isLoading: isLoadingGroups } =
    trpc.messages.getGroups.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: 30000, // Poll every 30 seconds for new groups
    });

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
