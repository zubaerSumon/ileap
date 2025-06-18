import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

export const useConversations = () => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  const { data: conversations, isLoading: isLoadingConversations } =
    trpc.messages.getConversations.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    });

  const { data: groups, isLoading: isLoadingGroups } =
    trpc.messages.getGroups.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
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
