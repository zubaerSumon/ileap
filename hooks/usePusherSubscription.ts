import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import { pusherClient } from '@/lib/pusher';
import toast from 'react-hot-toast';

interface PusherMessageData {
  type: string;
  data: {
    message?: Record<string, unknown>;
    conversationId?: string;
    groupId?: string;
  };
}

export const usePusherSubscription = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const channelRef = useRef<unknown>(null);

  // Subscribe to real-time updates via Pusher
  useEffect(() => {
    if (!session?.user?.id) return;

    console.log('📡 Connecting to Pusher for user:', session.user.id);

    // Subscribe to user's channel
    const channel = pusherClient.subscribe(`user-${session.user.id}`);
    channelRef.current = channel;

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('✅ Pusher connection succeeded for user:', session.user.id);
    });

    channel.bind('new_message', (data: PusherMessageData) => {
      console.log('📨 Received Pusher new_message event:', data);
      
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
        messageContent: (messageData.content as string)?.substring(0, 50),
        senderRole: (messageData.sender as Record<string, unknown>)?.role,
        receiverRole: (messageData.receiver as Record<string, unknown>)?.role
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
    });

    channel.bind('message_read', (data: PusherMessageData) => {
      console.log('📖 Message read event received via Pusher');
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
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    channel.bind('conversation_update', (_data: PusherMessageData) => {
      console.log('🔄 Conversation update received via Pusher');
      utils.messages.getConversations.invalidate();
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    channel.bind('group_update', (_data: PusherMessageData) => {
      console.log('🔄 Group update received via Pusher');
      utils.messages.getGroups.invalidate();
    });

    return () => {
      console.log('📡 Disconnecting from Pusher for user:', session.user.id);
      if (channelRef.current) {
        pusherClient.unsubscribe(`user-${session.user.id}`);
        channelRef.current = null;
      }
    };
  }, [session?.user?.id, selectedUserId, isGroup, utils]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        pusherClient.unsubscribe(`user-${session?.user?.id}`);
      }
    };
  }, [session?.user?.id]);

  return {
    isConnected: !!channelRef.current,
  };
}; 