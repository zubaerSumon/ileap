import { observable } from '../../trpc';
import { EventEmitter } from 'events';

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

// Simple in-memory pub/sub system
class MessagePubSub extends EventEmitter {
  private static instance: MessagePubSub;

  static getInstance(): MessagePubSub {
    if (!MessagePubSub.instance) {
      MessagePubSub.instance = new MessagePubSub();
    }
    return MessagePubSub.instance;
  }

  publishNewMessage(userId: string, message: Record<string, unknown>) {
    console.log('📤 Publishing new message to user:', userId, 'message ID:', (message as any)._id);
    this.emit(`message:${userId}`, {
      type: 'new_message',
      data: { message }
    });
    console.log('📤 Message published successfully to user:', userId);
  }

  publishGroupMessage(groupMembers: string[], message: Record<string, unknown>) {
    // Publish to all group members
    groupMembers.forEach(memberId => {
      this.emit(`message:${memberId}`, {
        type: 'new_message',
        data: { message }
      });
    });
  }

  publishMessageRead(userId: string, conversationId: string) {
    this.emit(`message:${userId}`, {
      type: 'message_read',
      data: { conversationId }
    });
  }

  publishConversationUpdate(userId: string, conversations: Record<string, unknown>[]) {
    this.emit(`conversation:${userId}`, {
      type: 'conversation_update',
      data: { conversations, userId }
    });
  }

  publishGroupUpdate(userId: string, groups: Record<string, unknown>[]) {
    this.emit(`group:${userId}`, {
      type: 'group_update',
      data: { groups, userId }
    });
  }

  subscribeToMessages(userId: string) {
    return observable<MessageEvent>((emit) => {
      const handler = (data: MessageEvent) => {
        emit.next(data);
      };

      this.on(`message:${userId}`, handler);

      return () => {
        this.off(`message:${userId}`, handler);
      };
    });
  }

  subscribeToConversations(userId: string) {
    return observable<ConversationEvent>((emit) => {
      const conversationHandler = (data: ConversationEvent) => {
        emit.next(data);
      };

      const groupHandler = (data: ConversationEvent) => {
        emit.next(data);
      };

      this.on(`conversation:${userId}`, conversationHandler);
      this.on(`group:${userId}`, groupHandler);

      return () => {
        this.off(`conversation:${userId}`, conversationHandler);
        this.off(`group:${userId}`, groupHandler);
      };
    });
  }
}

export const messagePubSub = MessagePubSub.getInstance(); 