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
    this.emit(`message:${userId}`, {
      type: 'new_message',
      data: { message }
    });
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
}

export const messagePubSub = MessagePubSub.getInstance(); 