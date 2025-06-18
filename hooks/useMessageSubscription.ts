import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';

export const useMessageSubscription = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const eventSourceRef = useRef<EventSource | null>(null);

  // Subscribe to real-time updates via Server-Sent Events
  useEffect(() => {
    if (!session?.user?.id) return;

    console.log('📡 Connecting to SSE for user:', session.user.id);

    // Create EventSource connection
    const eventSource = new EventSource('/api/messages/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ SSE connection opened for user:', session.user.id);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Received SSE event:', data);
        
        // Skip heartbeat and connection messages
        if (data.type === 'heartbeat' || data.type === 'connected') {
          return;
        }
        
        if (data.type === 'new_message') {
          const messageData = data.data.message as Record<string, unknown>;
          
          // Check if this message is for the current conversation
          const currentUserId = session?.user?.id;
          const messageSender = (messageData.sender as Record<string, unknown>)?._id;
          const messageReceiver = (messageData.receiver as Record<string, unknown>)?._id;
          
          const isForCurrentConversation = isGroup 
            ? (messageData.group as Record<string, unknown>)?._id === selectedUserId
            : (messageSender === selectedUserId || messageReceiver === selectedUserId);
          
          console.log('📨 Message check:', {
            isGroup,
            currentUserId,
            selectedUserId,
            messageSender,
            messageReceiver,
            messageGroup: (messageData.group as Record<string, unknown>)?._id,
            isForCurrentConversation
          });
          
          if (isForCurrentConversation && selectedUserId) {
            console.log('🔄 Updating current conversation with new message');
            
            // Force refetch the messages immediately
            if (isGroup) {
              utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId });
              utils.messages.getGroupMessages.refetch({ groupId: selectedUserId });
            } else {
              utils.messages.getMessages.invalidate({ userId: selectedUserId });
              utils.messages.getMessages.refetch({ userId: selectedUserId });
            }
          }
          
          // Always invalidate conversations to update the list
          utils.messages.getConversations.invalidate();
          utils.messages.getConversations.refetch();
        }
        
        if (data.type === 'message_read' && selectedUserId) {
          console.log('📖 Message read event received');
          // Update read status
          utils.messages.getConversations.invalidate();
          utils.messages.getConversations.refetch();
          if (isGroup) {
            utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId });
            utils.messages.getGroupMessages.refetch({ groupId: selectedUserId });
          } else {
            utils.messages.getMessages.invalidate({ userId: selectedUserId });
            utils.messages.getMessages.refetch({ userId: selectedUserId });
          }
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      console.log('📡 Closing SSE connection for user:', session.user.id);
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [session?.user?.id, selectedUserId, isGroup, utils]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Expose connection status
  const isConnected = eventSourceRef.current?.readyState === EventSource.OPEN;

  return {
    isConnected,
  };
}; 