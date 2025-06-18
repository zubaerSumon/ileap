import { useCallback, useEffect, useRef } from 'react';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';

export const useMessageRefresh = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const lastUnreadCount = useRef<number>(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRefresh = useRef<boolean>(false);

  // Get conversations to monitor unread count
  const { data: conversations } = trpc.messages.getConversations.useQuery(
    undefined,
    {
      enabled: !!session?.user?.id,
      staleTime: 0, // Always fresh to detect changes
      refetchInterval: 3000, // Check every 3 seconds
    }
  );

  // Calculate total unread count
  const totalUnreadCount = conversations?.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0
  ) || 0;

  // Debounced refresh function to prevent excessive updates
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      console.log('🔄 Debounced refresh triggered from unread count change (5s delay)');
      hasTriggeredRefresh.current = false; // Reset flag after refresh
      
      // Invalidate relevant queries to ensure fresh data
      if (selectedUserId) {
        if (isGroup) {
          utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId });
        } else {
          utils.messages.getMessages.invalidate({ userId: selectedUserId });
        }
      }
      
      // Always refresh conversations and groups
      utils.messages.getConversations.invalidate();
      utils.messages.getGroups.invalidate();
    }, 5000); // 5 second delay
  }, [selectedUserId, isGroup, utils.messages]);

  // Monitor unread count changes and trigger refresh
  useEffect(() => {
    // Only trigger if unread count increased and we haven't already triggered a refresh
    if (totalUnreadCount > lastUnreadCount.current && !hasTriggeredRefresh.current) {
      console.log('🔄 Unread count increased, triggering debounced refresh...', {
        previous: lastUnreadCount.current,
        current: totalUnreadCount
      });
      hasTriggeredRefresh.current = true; // Mark as triggered
      debouncedRefresh();
    }
    lastUnreadCount.current = totalUnreadCount;
  }, [totalUnreadCount, debouncedRefresh]);

  // Cleanup function to clear timeout on unmount
  const cleanup = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  }, []);

  return {
    totalUnreadCount,
    cleanup,
  };
}; 