# Real-time Messaging Setup Guide

This guide explains how to set up and use the tRPC pubsub integration for real-time messaging in your application.

## Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- MongoDB database

## Installation

The required dependencies have already been installed:
- `@trpc/server@next` - tRPC server with WebSocket support
- `ws` - WebSocket server implementation
- `@types/ws` - TypeScript types for WebSocket

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# WebSocket Server Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:3001
WS_PORT=3001
```

## Running the Application

### Development Mode

1. **Start the Next.js development server:**
   ```bash
   pnpm dev
   ```

2. **In a separate terminal, start the WebSocket server:**
   ```bash
   pnpm dev:ws
   ```

### Production Mode

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Start the Next.js server:**
   ```bash
   pnpm start
   ```

3. **Start the WebSocket server:**
   ```bash
   pnpm start:ws
   ```

## How It Works

### Server-Side (tRPC Pubsub)

1. **Event Emitter**: The server uses Node.js `EventEmitter` to handle real-time events
2. **WebSocket Server**: Handles WebSocket connections for subscriptions
3. **Subscription Procedures**: 
   - `onMessage` - Subscribes to new messages and read status updates
   - `onConversationUpdate` - Subscribes to conversation list updates

### Client-Side

1. **Split Links**: The client automatically uses WebSocket for subscriptions and HTTP for queries/mutations
2. **Real-time Hook**: `useRealtimeMessages` handles subscription management
3. **Automatic Updates**: Messages and conversations are automatically updated in real-time

## Features

### Real-time Message Updates
- New messages appear instantly without page refresh
- Message read status updates in real-time
- Optimistic updates for better UX

### Conversation Updates
- Conversation list updates automatically
- Unread message counts update in real-time
- Group message support

### Automatic Cleanup
- Subscriptions are automatically cleaned up when components unmount
- WebSocket connections are properly managed

## Usage Example

```tsx
import { useMessages } from '@/hooks/useMessages';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';

function ChatComponent({ selectedUserId, isGroup }) {
  // This hook now automatically enables real-time updates
  const { messages, sendMessage } = useMessages(selectedUserId, isGroup);
  
  // Messages will automatically update in real-time
  return (
    <div>
      {messages?.pages.map((page, i) => (
        <div key={i}>
          {page.messages.map((message) => (
            <MessageComponent key={message._id} message={message} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### WebSocket Connection Issues

1. **Check if WebSocket server is running:**
   ```bash
   pnpm dev:ws
   ```

2. **Verify environment variables:**
   - `NEXT_PUBLIC_WS_URL` should point to your WebSocket server
   - `WS_PORT` should match the port in your WebSocket URL

3. **Check browser console for connection errors**

### TypeScript Errors

If you encounter TypeScript errors related to tRPC versions:
1. Ensure all tRPC packages are the same version
2. Run `pnpm add @trpc/client@next @trpc/next@next @trpc/react-query@next @trpc/server@next`

### Performance Considerations

- Subscriptions are automatically enabled/disabled based on component state
- Messages are cached and invalidated efficiently
- WebSocket connections are reused across components

## Security

- All subscriptions require authentication
- Messages are filtered by user permissions
- WebSocket connections are validated against user sessions 