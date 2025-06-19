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
          
          // Convert IDs to strings for comparison
          const senderIdStr = typeof messageSender === 'string' ? messageSender : String(messageSender);
          const receiverIdStr = typeof messageReceiver === 'string' ? messageReceiver : String(messageReceiver);
          const groupIdStr = typeof messageGroup === 'string' ? messageGroup : String(messageGroup);
          const selectedUserIdStr = selectedUserId ? String(selectedUserId) : null;
          
          const isForCurrentConversation = isGroup 
            ? groupIdStr === selectedUserIdStr
            : (senderIdStr === selectedUserIdStr || receiverIdStr === selectedUserIdStr);
          
          console.log('📨 Message check:', {
            isGroup,
            currentUserId,
            selectedUserId,
            selectedUserIdStr,
            messageSender,
            messageReceiver,
            messageGroup,
            senderIdStr,
            receiverIdStr,
            groupIdStr,
            isForCurrentConversation,
            messageContent: (messageData.content as string)?.substring(0, 50)
          });
          
          // Show toast notification if message is not from current user and not for current conversation
          const isFromCurrentUser = senderIdStr === currentUserId;
          const shouldShowToast = !isFromCurrentUser && !isForCurrentConversation;
          
          console.log('🔔 Toast notification check:', {
            isFromCurrentUser,
            isForCurrentConversation,
            shouldShowToast,
            senderIdStr,
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
          
          // Always invalidate conversations and messages to ensure real-time updates
          console.log('🔄 Invalidating conversations and messages for real-time update');
          utils.messages.getConversations.invalidate();
          utils.messages.getGroups.invalidate();
          
          // If it's for the current conversation, also invalidate messages
          if (isForCurrentConversation) {
            console.log('🔄 Invalidating messages for current conversation');
            utils.messages.getMessages.invalidate();
          }
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

  return {
    isConnected: !!eventSourceRef.current,
  };
}; 