import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

export const useRealtimeMessages = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();

  console.log('🔧 useRealtimeMessages - Session:', session?.user?.id, 'SelectedUser:', selectedUserId, 'IsGroup:', isGroup);

  // Poll for messages using existing procedures with refetch intervals
  trpc.messages.getMessages.useInfiniteQuery(
    { 
      userId: selectedUserId || "",
      limit: 20
    },
    { 
      enabled: !!selectedUserId && !isGroup && !!session?.user?.id,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: 3000, // Poll every 3 seconds
      refetchIntervalInBackground: true,
      staleTime: 0, // Always consider data stale
    }
  );

  trpc.messages.getGroupMessages.useInfiniteQuery(
    { 
      groupId: selectedUserId || "",
      limit: 20
    },
    { 
      enabled: !!selectedUserId && isGroup && !!session?.user?.id,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: 3000, // Poll every 3 seconds
      refetchIntervalInBackground: true,
      staleTime: 0, // Always consider data stale
    }
  );

  // Poll for conversations and groups updates
  trpc.messages.getConversations.useQuery(
    undefined,
    {
      enabled: !!session?.user?.id,
      refetchInterval: 5000, // Poll every 5 seconds
      refetchIntervalInBackground: true,
    }
  );

  trpc.messages.getGroups.useQuery(
    undefined,
    {
      enabled: !!session?.user?.id,
      refetchInterval: 5000, // Poll every 5 seconds
      refetchIntervalInBackground: true,
    }
  );

  // The polling will automatically update the cache and trigger re-renders
  // No need for manual cache invalidation since we're using refetch intervals
}; 