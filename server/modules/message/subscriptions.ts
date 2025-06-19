import { observable } from '../../trpc';
import { pusher } from '../../../lib/pusher';

// Message event types
interface MessageEvent {
  type: 'new_message' | 'message_read';
  data: {
    message?: Record<string, unknown>;
    conversationId?: string;
    groupId?: string;
  };
}

// Conversation event types
interface ConversationEvent {
  type: 'conversation_update' | 'group_update';
  data: {
    conversations?: Record<string, unknown>[];
    groups?: Record<string, unknown>[];
    userId?: string;
  };
}

// Pusher-based pub/sub system
class MessagePubSub {
  private static instance: MessagePubSub;

  static getInstance(): MessagePubSub {
    if (!MessagePubSub.instance) {
      MessagePubSub.instance = new MessagePubSub();
    }
    return MessagePubSub.instance;
  }

  async publishNewMessage(userId: string, message: Record<string, unknown>) {
    console.log('📤 Publishing new message to user via Pusher:', userId, 'message ID:', (message as Record<string, unknown>)._id);
    
    try {
      await pusher.trigger(`user-${userId}`, 'new_message', {
        type: 'new_message',
        data: { message }
      });
      console.log('📤 Message published successfully to user via Pusher:', userId);
    } catch (error) {
      console.error('❌ Error publishing message via Pusher:', error);
    }
  }

  async publishGroupMessage(groupMembers: string[], message: Record<string, unknown>) {
    console.log('📤 Publishing group message via Pusher to members:', groupMembers);
    
    try {
      // Publish to all group members
      for (const memberId of groupMembers) {
        await pusher.trigger(`user-${memberId}`, 'new_message', {
          type: 'new_message',
          data: { message }
        });
      }
      console.log('📤 Group message published successfully via Pusher');
    } catch (error) {
      console.error('❌ Error publishing group message via Pusher:', error);
    }
  }

  async publishMessageRead(userId: string, conversationId: string) {
    console.log('📤 Publishing message read via Pusher:', userId, conversationId);
    
    try {
      await pusher.trigger(`user-${userId}`, 'message_read', {
        type: 'message_read',
        data: { conversationId }
      });
    } catch (error) {
      console.error('❌ Error publishing message read via Pusher:', error);
    }
  }

  async publishConversationUpdate(userId: string, conversations: Record<string, unknown>[]) {
    console.log('📤 Publishing conversation update via Pusher:', userId);
    
    try {
      await pusher.trigger(`user-${userId}`, 'conversation_update', {
        type: 'conversation_update',
        data: { conversations, userId }
      });
    } catch (error) {
      console.error('❌ Error publishing conversation update via Pusher:', error);
    }
  }

  async publishGroupUpdate(userId: string, groups: Record<string, unknown>[]) {
    console.log('📤 Publishing group update via Pusher:', userId);
    
    try {
      await pusher.trigger(`user-${userId}`, 'group_update', {
        type: 'group_update',
        data: { groups, userId }
      });
    } catch (error) {
      console.error('❌ Error publishing group update via Pusher:', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribeToMessages(_userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return observable<MessageEvent>((_emit) => {
      // This is now handled by the client-side Pusher subscription
      // The observable is kept for compatibility but won't be used
      return () => {
        // Cleanup if needed
      };
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribeToConversations(_userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return observable<ConversationEvent>((_emit) => {
      // This is now handled by the client-side Pusher subscription
      // The observable is kept for compatibility but won't be used
      return () => {
        // Cleanup if needed
      };
    });
  }
}

export const messagePubSub = MessagePubSub.getInstance(); 