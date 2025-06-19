import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

interface SSEMessage {
  type: string;
  data?: {
    message?: Record<string, unknown>;
  };
}

export const useMessageSubscription = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const handleSSEMessage = useCallback((data: SSEMessage) => {
    console.log('📨 Received SSE event:', data);
    
    if (data.type === 'new_message') {
      const messageData = data.data?.message as Record<string, unknown>;
      
      // Check if this message is for the current conversation
      const currentUserId = session?.user?.id;
      const messageSender = (messageData.sender as Record<string, unknown>)?._id;
      const messageReceiver = (messageData.receiver as Record<string, unknown>)?._id;
      const messageGroup = (messageData.group as Record<string, unknown>)?._id;
      
      const isForCurrentConversation = isGroup 
        ? messageGroup === selectedUserId
        : (messageSender === selectedUserId || messageReceiver === selectedUserId);
      
      // Show toast notification if message is not from current user and not for current conversation
      const isFromCurrentUser = messageSender === currentUserId;
      const shouldShowToast = !isFromCurrentUser && !isForCurrentConversation;
      
      if (shouldShowToast) {
        const senderName = (messageData.sender as Record<string, unknown>)?.name || 'Someone';
        const groupName = (messageData.group as Record<string, unknown>)?.name;
        const messageContent = (messageData.content as string) || '';
        
        if (messageData.group) {
          // Group message
          toast.success(`${senderName} sent a message in ${groupName}: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}`, {
            duration: 4000,
            position: 'top-right',
          });
        } else {
          // Direct message
          toast.success(`${senderName} sent you a message: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}`, {
            duration: 4000,
            position: 'top-right',
          });
        }
      }
      
      // Update current conversation if message is for it
      if (isForCurrentConversation && selectedUserId) {
        console.log('🔄 Updating current conversation with new message');
        
        if (isGroup) {
          utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId, limit: 20 });
        } else {
          utils.messages.getMessages.invalidate({ userId: selectedUserId, limit: 20 });
        }
      }
      
      // Update sidebar (conversations and groups lists)
      utils.messages.getConversations.invalidate();
      utils.messages.getGroups.invalidate();
    }
    
    if (data.type === 'message_read' && selectedUserId) {
      console.log('📖 Message read event received');
      // Update read status
      utils.messages.getConversations.invalidate();
      if (isGroup) {
        utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId, limit: 20 });
      } else {
        utils.messages.getMessages.invalidate({ userId: selectedUserId, limit: 20 });
      }
    }
  }, [session?.user?.id, selectedUserId, isGroup, utils]);

  // Subscribe to real-time updates via Server-Sent Events
  useEffect(() => {
    if (!session?.user?.id) return;

    // Check if EventSource is available (client-side only)
    if (typeof EventSource === 'undefined') {
      console.warn('EventSource is not available in this environment, falling back to polling');
      return;
    }

    console.log('📡 Connecting to SSE for user:', session.user.id);

    const connectSSE = () => {
      // Close existing connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create EventSource connection
      const eventSource = new EventSource('/api/messages/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('✅ SSE connection opened for user:', session.user.id);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SSEMessage;
          if (data.type !== 'heartbeat' && data.type !== 'connected') {
            handleSSEMessage(data);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        
        // Implement reconnection logic
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000); // Exponential backoff, max 30s
          
          console.log(`🔄 Attempting to reconnect in ${reconnectDelay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectSSE();
          }, reconnectDelay);
        } else {
          console.error('❌ Max reconnection attempts reached');
        }
      };

      return eventSource;
    };

    const eventSource = connectSSE();

    return () => {
      console.log('📡 Closing SSE connection for user:', session.user.id);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [session?.user?.id, selectedUserId, isGroup, handleSSEMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Expose connection status
  const isConnected = eventSourceRef.current?.readyState === EventSource.OPEN;

  return {
    isConnected,
  };
}; 