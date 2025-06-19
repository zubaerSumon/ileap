import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

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
          const messageGroup = (messageData.group as Record<string, unknown>)?._id;
          
          console.log('📨 Raw message data:', messageData);
          console.log('📨 Message fields:', {
            messageSender,
            messageReceiver,
            messageGroup,
            hasGroup: !!messageData.group,
            groupData: messageData.group
          });
          
          const isForCurrentConversation = isGroup 
            ? messageGroup === selectedUserId
            : (messageSender === selectedUserId || messageReceiver === selectedUserId);
          
          console.log('📨 Message check:', {
            isGroup,
            currentUserId,
            selectedUserId,
            messageSender,
            messageReceiver,
            messageGroup,
            isForCurrentConversation,
            messageContent: (messageData.content as string)?.substring(0, 50)
          });
          
          // Show toast notification if message is not from current user and not for current conversation
          const isFromCurrentUser = messageSender === currentUserId;
          const shouldShowToast = !isFromCurrentUser && !isForCurrentConversation;
          
          console.log('🔔 Toast notification check:', {
            isFromCurrentUser,
            isForCurrentConversation,
            shouldShowToast,
            messageSender,
            currentUserId
          });
          
          if (shouldShowToast) {
            const senderName = (messageData.sender as Record<string, unknown>)?.name || 'Someone';
            const groupName = (messageData.group as Record<string, unknown>)?.name;
            const messageContent = (messageData.content as string) || '';
            
            if (messageData.group) {
              // Group message
              console.log('🔔 Showing group message toast:', `${senderName} sent a message in ${groupName}`);
              toast.success(`${senderName} sent a message in ${groupName}: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}`, {
                duration: 4000,
                position: 'top-right',
              });
            } else {
              // Direct message
              console.log('🔔 Showing direct message toast:', `${senderName} sent you a message`);
              toast.success(`${senderName} sent you a message: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}`, {
                duration: 4000,
                position: 'top-right',
              });
            }
          }
          
          if (isForCurrentConversation && selectedUserId) {
            console.log('🔄 Updating current conversation with new message');
            
            // Force complete cache invalidation and refetch
            if (isGroup) {
              console.log('🔄 Force invalidating group messages for groupId:', selectedUserId);
              // Invalidate all group message queries
              utils.messages.getGroupMessages.invalidate();
              // Force a refetch after a short delay
              setTimeout(() => {
                console.log('🔄 Force refetching group messages');
                utils.messages.getGroupMessages.refetch();
              }, 200);
            } else {
              console.log('🔄 Force invalidating direct messages for userId:', selectedUserId);
              // Invalidate all direct message queries
              utils.messages.getMessages.invalidate();
              // Force a refetch after a short delay
              setTimeout(() => {
                console.log('🔄 Force refetching direct messages');
                utils.messages.getMessages.refetch();
              }, 200);
            }
          }
          
          // Always invalidate conversations and groups to update the sidebar
          console.log('🔄 Invalidating conversations and groups lists');
          
          // Invalidate all conversations and groups queries
          utils.messages.getConversations.invalidate();
          utils.messages.getGroups.invalidate();
          
          // Force immediate refetch
          console.log('🔄 Force refetching conversations and groups');
          utils.messages.getConversations.refetch();
          utils.messages.getGroups.refetch();
          
          // Force another refetch after a delay to ensure updates
          setTimeout(() => {
            console.log('🔄 Delayed refetch of conversations and groups');
            utils.messages.getConversations.refetch();
            utils.messages.getGroups.refetch();
          }, 500);
          
          // Also try to invalidate all message-related queries
          setTimeout(() => {
            console.log('🔄 Invalidating all message queries');
            utils.messages.getConversations.invalidate();
            utils.messages.getGroups.invalidate();
            utils.messages.getMessages.invalidate();
            utils.messages.getGroupMessages.invalidate();
          }, 1000);
          
          // Final attempt with longer delay
          setTimeout(() => {
            console.log('🔄 Final attempt to update sidebar');
            utils.messages.getConversations.invalidate();
            utils.messages.getGroups.invalidate();
            utils.messages.getConversations.refetch();
            utils.messages.getGroups.refetch();
          }, 2000);
        }
        
        if (data.type === 'message_read' && selectedUserId) {
          console.log('📖 Message read event received');
          // Update read status
          utils.messages.getConversations.invalidate();
          utils.messages.getConversations.refetch();
          if (isGroup) {
            utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId, limit: 20 });
          } else {
            utils.messages.getMessages.invalidate({ userId: selectedUserId, limit: 20 });
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