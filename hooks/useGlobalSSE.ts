import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

interface SSEMessage {
  type: string;
  data?: {
    message?: Record<string, unknown>;
  };
}

// Global SSE connection manager (client-side only)
class SSEManager {
  private static instance: SSEManager;
  private eventSource: EventSource | null = null;
  private listeners: Set<(data: SSEMessage) => void> = new Set();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private userId: string | null = null;

  static getInstance(): SSEManager {
    if (!SSEManager.instance) {
      SSEManager.instance = new SSEManager();
    }
    return SSEManager.instance;
  }

  connect(userId: string) {
    // Check if EventSource is available (client-side only)
    if (typeof EventSource === 'undefined') {
      console.warn('EventSource is not available in this environment');
      return;
    }

    if (this.userId === userId && this.eventSource?.readyState === EventSource.OPEN) {
      return; // Already connected for this user
    }

    this.disconnect();
    this.userId = userId;
    this.reconnectAttempts = 0;

    console.log('📡 Global SSE Manager: Connecting for user:', userId);
    this.eventSource = new EventSource('/api/messages/stream');

    this.eventSource.onopen = () => {
      console.log('✅ Global SSE Manager: Connection opened for user:', userId);
      this.reconnectAttempts = 0;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEMessage;
        if (data.type !== 'heartbeat' && data.type !== 'connected') {
          // Notify all listeners
          this.listeners.forEach(listener => listener(data));
        }
      } catch (error) {
        console.error('Global SSE Manager: Error parsing message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('Global SSE Manager: Connection error:', error);
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
      const reconnectDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`🔄 Global SSE Manager: Attempting to reconnect in ${reconnectDelay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(this.userId!);
      }, reconnectDelay);
    } else {
      console.error('❌ Global SSE Manager: Max reconnection attempts reached');
    }
  }

  addListener(listener: (data: SSEMessage) => void) {
    this.listeners.add(listener);
  }

  removeListener(listener: (data: SSEMessage) => void) {
    this.listeners.delete(listener);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.userId = null;
    this.listeners.clear();
  }

  isConnected(): boolean {
    // Check if EventSource is available before accessing it
    if (typeof EventSource === 'undefined') {
      return false;
    }
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

export const useGlobalSSE = () => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const sseManager = SSEManager.getInstance();

  // Global message handler for notifications and cache updates
  const handleGlobalMessage = useCallback((data: SSEMessage) => {
    console.log('📨 Global SSE received event:', data);
    
    if (data.type === 'new_message') {
      const messageData = data.data?.message as Record<string, unknown>;
      
      // Check if this message is for the current user
      const currentUserId = session?.user?.id;
      const messageSender = (messageData.sender as Record<string, unknown>)?._id;
      const messageReceiver = (messageData.receiver as Record<string, unknown>)?._id;
      const messageGroup = (messageData.group as Record<string, unknown>)?._id;
      
      // Show toast notification if message is not from current user
      const isFromCurrentUser = messageSender === currentUserId;
      const isForCurrentUser = isFromCurrentUser || 
        messageReceiver === currentUserId || 
        (messageGroup && messageData.group); // For group messages, show to all group members
      
      if (isForCurrentUser && !isFromCurrentUser) {
        const senderName = (messageData.sender as Record<string, unknown>)?.name || 'Someone';
        const groupName = (messageData.group as Record<string, unknown>)?.name;
        const messageContent = (messageData.content as string) || '';
        
        if (messageData.group) {
          // Group message - clearer format
          toast.success(
            `💬 ${senderName} sent a message in ${groupName}\n${messageContent.substring(0, 100)}${messageContent.length > 100 ? '...' : ''}`, 
            {
              duration: 5000,
              position: 'top-right',
              style: {
                background: '#10b981',
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.4',
                maxWidth: '400px',
                whiteSpace: 'pre-line',
              },
            }
          );
        } else {
          // Direct message - clearer format
          toast.success(
            `💬 ${senderName} sent you a message\n${messageContent.substring(0, 100)}${messageContent.length > 100 ? '...' : ''}`, 
            {
              duration: 5000,
              position: 'top-right',
              style: {
                background: '#3b82f6',
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.4',
                maxWidth: '400px',
                whiteSpace: 'pre-line',
              },
            }
          );
        }
      }
      
      // Update conversations and groups lists for sidebar
      utils.messages.getConversations.invalidate();
      utils.messages.getGroups.invalidate();
      
      // Also invalidate all message queries to ensure UI updates
      // This ensures that any open conversation will show the new message
      if (messageData.group) {
        // For group messages, invalidate group messages query
        utils.messages.getGroupMessages.invalidate();
      } else {
        // For direct messages, invalidate direct messages query
        utils.messages.getMessages.invalidate();
      }
    }
    
    if (data.type === 'message_read') {
      // Update read status
      utils.messages.getConversations.invalidate();
      utils.messages.getMessages.invalidate();
      utils.messages.getGroupMessages.invalidate();
    }
  }, [session?.user?.id, utils]);

  // Connect to SSE when user is authenticated
  useEffect(() => {
    // Check if we're on the client side and EventSource is available
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
      return;
    }

    if (session?.user?.id) {
      sseManager.connect(session.user.id);
      sseManager.addListener(handleGlobalMessage);
    }

    return () => {
      sseManager.removeListener(handleGlobalMessage);
    };
  }, [session?.user?.id, handleGlobalMessage]);

  return {
    sseManager,
    isConnected: sseManager.isConnected(),
  };
}; 