import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

export const useMessageSubscription = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  // SSE subscription for real-time message updates
  const subscription = trpc.messages.subscribeToMessages.useSubscription(
    { userId: selectedUserId || undefined, isGroup },
    {
      enabled: !!session?.user?.id,
      onData: (data) => {
        console.log('📡 useMessageSubscription: Received message update:', data);
        
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
          
          // For current conversation, let the main message hooks handle the updates
          // Only invalidate if it's not for the current conversation to update sidebar
          if (!isForCurrentConversation) {
            console.log('🔄 Invalidating conversations and groups for sidebar update');
            utils.messages.getConversations.invalidate();
            utils.messages.getGroups.invalidate();
          }
        }
        
        if (data.type === 'message_read' && selectedUserId) {
          console.log('📖 Message read event received');
          // Update read status - let the main message hooks handle this
          // Only invalidate if it's not for the current conversation
          if (!isGroup) {
            const messageSender = (data.data.message as Record<string, unknown>)?.sender as Record<string, unknown>;
            const isForCurrentConversation = messageSender?._id === selectedUserId;
            
            if (!isForCurrentConversation) {
              utils.messages.getConversations.invalidate();
            }
          }
        }
        
        if (data.type === 'conversation_update') {
          console.log('🔄 Conversation update received');
          // Update conversations
          utils.messages.getConversations.invalidate();
          utils.messages.getGroups.invalidate();
        }
      },
      onError: (error) => {
        console.error('📡 useMessageSubscription: Subscription error:', error);
      },
    }
  );

  return {
    isConnected: subscription.status !== 'error',
  };
}; 