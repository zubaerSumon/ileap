import { WebSocketServer, WebSocket } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from './index';
import { createContext } from './config/context';

export function createWSServer(port: number) {
  const wss = new WebSocketServer({ 
    port,
    // Add connection timeout and keep-alive settings
    clientTracking: true,
    perMessageDeflate: false, // Disable compression for better performance
  });
  
  // Track connection status using a Map
  const connectionStatus = new Map<WebSocket, boolean>();
  
  const handler = applyWSSHandler({
    wss,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: appRouter as any,
    createContext,
  });

  // Add error handling for the WebSocket server
  wss.on('error', (error) => {
    console.error('❌ WebSocket Server Error:', error);
  });

  wss.on('connection', (ws, request) => {
    console.log('➕ Connection established from:', request.socket.remoteAddress);
    
    // Set up ping/pong to keep connection alive
    connectionStatus.set(ws, true);
    ws.on('pong', () => {
      connectionStatus.set(ws, true);
    });

    // Handle connection errors
    ws.on('error', (error) => {
      console.error('❌ WebSocket Connection Error:', error);
    });

    ws.once('close', (code, reason) => {
      console.log('➖ Connection closed:', { code, reason: reason?.toString() });
      connectionStatus.delete(ws);
    });
  });

  // Set up ping interval to detect stale connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const isAlive = connectionStatus.get(ws);
      if (isAlive === false) {
        console.log('💀 Terminating stale connection');
        connectionStatus.delete(ws);
        return ws.terminate();
      }
      
      connectionStatus.set(ws, false);
      ws.ping();
    });
  }, 30000); // Ping every 30 seconds

  // Clean up interval on server close
  wss.on('close', () => {
    clearInterval(interval);
    connectionStatus.clear();
  });

  console.log(`✅ WebSocket Server listening on ws://localhost:${port}`);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down WebSocket server...');
    handler.broadcastReconnectNotification();
    wss.close();
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down WebSocket server...');
    handler.broadcastReconnectNotification();
    wss.close();
  });

  return wss;
} 