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
      refetchInterval: 15000, // Poll every 15 seconds for new conversations
    });

  const { data: groups, isLoading: isLoadingGroups } =
    trpc.messages.getGroups.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: 15000, // Poll every 15 seconds for new groups
    });

  const markAsReadMutation = trpc.messages.markAsRead.useMutation({
    onSuccess: () => {
      // Invalidate and refetch all message-related queries to update unread counts
      utils.messages.getConversations.invalidate();
      utils.messages.getGroups.invalidate();
      
      // Also invalidate any infinite queries that might be cached
      utils.messages.getMessages.invalidate();
      utils.messages.getGroupMessages.invalidate();
      
      // Force refetch to ensure immediate update
      utils.messages.getConversations.refetch();
      utils.messages.getGroups.refetch();
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
