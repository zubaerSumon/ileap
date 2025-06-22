import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';

// Global EventSource instance to prevent multiple connections
let globalEventSource: EventSource | null = null;
let globalEventSourceRefs = 0;

export const useMessageSubscription = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const eventSourceRef = useRef<EventSource | null>(null);

  // Subscribe to real-time updates via Server-Sent Events
  useEffect(() => {
    if (!session?.user?.id) return;

    console.log('📡 Connecting to SSE for user:', session.user.id);

    // Use global EventSource if it exists and is connected
    if (globalEventSource && globalEventSource.readyState === EventSource.OPEN) {
      console.log('📡 Reusing existing EventSource connection');
      eventSourceRef.current = globalEventSource;
      globalEventSourceRefs++;
      return;
    }

    // Create new EventSource connection
    const eventSource = new EventSource('/api/messages/stream');
    eventSourceRef.current = eventSource;
    globalEventSource = eventSource;
    globalEventSourceRefs++;

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
          const messageSender = (messageData.sender as Record<string, unknown>)?._id;
          const messageReceiver = (messageData.receiver as Record<string, unknown>)?._id;
          const messageGroup = (messageData.group as Record<string, unknown>)?._id;
          
          console.log('📨 Raw message data:', messageData);
          console.log('📨 Message fields:', {
            messageSender,
            messageReceiver,
            messageGroup,
            hasGroup: !!messageData.group,
            groupData: messageData.group,
            senderRole: (messageData.sender as Record<string, unknown>)?.role,
            receiverRole: (messageData.receiver as Record<string, unknown>)?.role
          });
          
          // Convert IDs to strings for comparison
          const senderIdStr = typeof messageSender === 'string' ? messageSender : String(messageSender);
          const receiverIdStr = typeof messageReceiver === 'string' ? messageReceiver : String(messageReceiver);
          const groupIdStr = typeof messageGroup === 'string' ? messageGroup : String(messageGroup);
          const selectedUserIdStr = selectedUserId ? String(selectedUserId) : null;
          
          const isForCurrentConversation = isGroup 
            ? groupIdStr === selectedUserIdStr
            : (senderIdStr === selectedUserIdStr || receiverIdStr === selectedUserIdStr);
          
          console.log('📨 Message check in useMessageSubscription:', {
            isGroup,
            selectedUserId,
            selectedUserIdStr,
            messageSender,
            messageReceiver,
            messageGroup,
            senderIdStr,
            receiverIdStr,
            groupIdStr,
            isForCurrentConversation
          });
          
          if (isForCurrentConversation && selectedUserId) {
            console.log('🔄 Updating current conversation with new message');
            // Invalidate and refetch messages
            utils.messages.getMessages.invalidate({ userId: selectedUserId, limit: 20 });
            utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId, limit: 20 });
          }
          
          // Always invalidate conversations to update sidebar
          utils.messages.getConversations.invalidate();
          utils.messages.getGroups.invalidate();
        }
        
        if (data.type === 'message_read' && selectedUserId) {
          console.log('📖 Message read event received');
          // Update read status - invalidate conversations to update unread counts
          utils.messages.getConversations.invalidate();
          
          // If it's for the current conversation, also invalidate messages
          if (!isGroup) {
            const messageSender = (data.data.message as Record<string, unknown>)?.sender as Record<string, unknown>;
            const senderIdStr = typeof messageSender?._id === 'string' ? messageSender._id : String(messageSender?._id);
            const isForCurrentConversation = senderIdStr === selectedUserId;
            
            if (isForCurrentConversation) {
              utils.messages.getMessages.invalidate();
            }
          }
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      console.error('SSE readyState:', eventSource.readyState);
      console.error('SSE URL:', eventSource.url);
      
      // Log additional error details
      if (error instanceof Event) {
        console.error('SSE error event:', {
          type: error.type,
          target: error.target,
          isTrusted: error.isTrusted,
          timeStamp: error.timeStamp
        });
      }
      
      // Reset global EventSource on error
      if (globalEventSource === eventSource) {
        globalEventSource = null;
        globalEventSourceRefs = 0;
      }
    };

    return () => {
      console.log('📡 Closing SSE connection for user:', session.user.id);
      globalEventSourceRefs--;
      
      // Only close if no other components are using it
      if (globalEventSourceRefs <= 0) {
        if (eventSource.readyState !== EventSource.CLOSED) {
          eventSource.close();
        }
        globalEventSource = null;
        globalEventSourceRefs = 0;
      }
      
      eventSourceRef.current = null;
    };
  }, [session?.user?.id, selectedUserId, isGroup, utils]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        globalEventSourceRefs--;
        if (globalEventSourceRefs <= 0) {
          if (eventSourceRef.current.readyState !== EventSource.CLOSED) {
            eventSourceRef.current.close();
          }
          globalEventSource = null;
          globalEventSourceRefs = 0;
        }
      }
    };
  }, []);

  return {
    isConnected: !!eventSourceRef.current && eventSourceRef.current.readyState === EventSource.OPEN,
  };
}; 