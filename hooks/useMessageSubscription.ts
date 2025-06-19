import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import { useGlobalSSE } from './useGlobalSSE';

interface SSEMessage {
  type: string;
  data?: {
    message?: Record<string, unknown>;
  };
}

export const useMessageSubscription = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const { sseManager, isConnected } = useGlobalSSE();

  const handleSSEMessage = useCallback((data: SSEMessage) => {
    console.log('📨 Message subscription received SSE event:', data);
    
    if (data.type === 'new_message') {
      const messageData = data.data?.message as Record<string, unknown>;
      
      // Check if this message is for the current conversation
      const messageSender = (messageData.sender as Record<string, unknown>)?._id;
      const messageReceiver = (messageData.receiver as Record<string, unknown>)?._id;
      const messageGroup = (messageData.group as Record<string, unknown>)?._id;
      
      const isForCurrentConversation = isGroup 
        ? messageGroup === selectedUserId
        : (messageSender === selectedUserId || messageReceiver === selectedUserId);
      
      // Update current conversation if message is for it
      if (isForCurrentConversation && selectedUserId) {
        console.log('🔄 Updating current conversation with new message');
        
        if (isGroup) {
          utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId, limit: 20 });
        } else {
          utils.messages.getMessages.invalidate({ userId: selectedUserId, limit: 20 });
        }
      }
    }
    
    if (data.type === 'message_read' && selectedUserId) {
      console.log('📖 Message read event received');
      // Update read status for current conversation
      if (isGroup) {
        utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId, limit: 20 });
      } else {
        utils.messages.getMessages.invalidate({ userId: selectedUserId, limit: 20 });
      }
    }
  }, [session?.user?.id, selectedUserId, isGroup, utils]);

  // Add listener to global SSE manager
  useEffect(() => {
    if (session?.user?.id) {
      sseManager.addListener(handleSSEMessage);
    }

    return () => {
      sseManager.removeListener(handleSSEMessage);
    };
  }, [session?.user?.id, handleSSEMessage, sseManager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sseManager.removeListener(handleSSEMessage);
    };
  }, [handleSSEMessage, sseManager]);

  return {
    isConnected,
  };
}; 