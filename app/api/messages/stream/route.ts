import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { messagePubSub } from '@/server/modules/message/subscriptions';
import User from '@/server/db/models/user';

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const userId = user._id.toString();
    console.log('📡 SSE: New connection for user:', userId);

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        const sendEvent = (data: Record<string, unknown>) => {
          const event = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(event));
        };

        // Send initial connection message
        sendEvent({
          type: 'connected',
          userId,
          timestamp: Date.now(),
        });

        // Subscribe to user's message channel
        const handler = (data: Record<string, unknown>) => {
          console.log('📥 SSE: Sending event to user:', userId, 'data:', data);
          sendEvent(data);
        };

        messagePubSub.on(`message:${userId}`, handler);
        console.log('📡 SSE: Subscribed to channel:', `message:${userId}`);

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          console.log('📡 SSE: User disconnected:', userId);
          messagePubSub.off(`message:${userId}`, handler);
          controller.close();
        });

        // Send heartbeat every 30 seconds to keep connection alive
        const heartbeat = setInterval(() => {
          sendEvent({
            type: 'heartbeat',
            timestamp: Date.now(),
          });
        }, 30000);

        // Cleanup heartbeat on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat);
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('SSE error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 