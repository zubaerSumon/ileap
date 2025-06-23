'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { trpc } from "@/utils/trpc";

interface SSEEvent {
  type: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

export default function TestSSEPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [userInfo, setUserInfo] = useState<unknown>(null);
  const [debugData, setDebugData] = useState<{
    totalInDB: number;
    archivedCount: number;
    nonArchivedCount: number;
    nonDeletedCount: number;
    sampleOpportunity: unknown;
  } | null>(null);

  const debugQuery = trpc.opportunities.debugOpportunities.useQuery();

  useEffect(() => {
    if (!session?.user?.id) return;

    console.log('🧪 Test SSE: User session:', session.user);
    setUserInfo(session.user);

    // Create EventSource connection
    const eventSource = new EventSource('/api/messages/stream');
    setConnectionStatus('connecting');

    eventSource.onopen = () => {
      console.log('✅ Test SSE: Connection opened');
      setConnectionStatus('connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Test SSE: Received event:', data);
        setEvents(prev => [...prev, { ...data, timestamp: new Date().toISOString() }]);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Test SSE: Connection error:', error);
      setConnectionStatus('error');
    };

    return () => {
      console.log('📡 Test SSE: Closing connection');
      eventSource.close();
      setConnectionStatus('disconnected');
    };
  }, [session?.user?.id]);

  const handleDebug = () => {
    debugQuery.refetch().then((result) => {
      if (result.data) {
        setDebugData(result.data);
      }
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">SSE Connection Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {connectionStatus}
              </span>
            </p>
            <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{session?.user?.id || 'Not logged in'}</code></p>
            <p><strong>Email:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{session?.user?.email || 'Not logged in'}</code></p>
            <p><strong>Name:</strong> {session?.user?.name || 'Not logged in'}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </div>
      </div>

      {/* Events Log */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Events Log</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-500">No events received yet...</p>
          ) : (
            events.map((event, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-600">{event.timestamp}</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(event, null, 2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open this page on two different computers/devices</li>
          <li>Log in with different user accounts on each device</li>
          <li>Send a message from one user to the other</li>
          <li>Check if the message appears in real-time on the receiver&apos;s device</li>
          <li>Monitor the events log to see if SSE events are being received</li>
        </ol>
      </div>

      <button 
        onClick={handleDebug}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Debug Opportunities
      </button>

      {debugData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Debug Results:</h2>
          <pre className="text-sm">{JSON.stringify(debugData, null, 2)}</pre>
        </div>
      )}

      {debugQuery.isLoading && <p>Loading...</p>}
      {debugQuery.error && (
        <div className="bg-red-100 p-4 rounded mt-4">
          <h3 className="text-red-800 font-semibold">Error:</h3>
          <p className="text-red-700">{debugQuery.error.message}</p>
        </div>
      )}
    </div>
  );
} 