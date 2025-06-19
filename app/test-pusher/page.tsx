'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePusherSubscription } from '@/hooks/usePusherSubscription';

export default function TestPusherPage() {
  const { data: session } = useSession();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [userInfo, setUserInfo] = useState<unknown>(null);

  // Test the Pusher subscription
  const { isConnected } = usePusherSubscription(null, false);

  useEffect(() => {
    if (!session?.user?.id) return;

    console.log('🧪 Test Pusher: User session:', session.user);
    setUserInfo(session.user);
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [session?.user?.id, isConnected]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Pusher Connection Test</h1>
      
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
            <p><strong>Role:</strong> {session?.user?.role || 'Not logged in'}</p>
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

      {/* Environment Variables Check */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Environment Variables Check</h2>
        <div className="space-y-2">
          <p><strong>PUSHER_APP_ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">
            {process.env.NEXT_PUBLIC_PUSHER_APP_ID ? '✅ Set' : '❌ Not set'}
          </code></p>
          <p><strong>NEXT_PUBLIC_PUSHER_KEY:</strong> <code className="bg-gray-100 px-2 py-1 rounded">
            {process.env.NEXT_PUBLIC_PUSHER_KEY ? '✅ Set' : '❌ Not set'}
          </code></p>
          <p><strong>NEXT_PUBLIC_PUSHER_CLUSTER:</strong> <code className="bg-gray-100 px-2 py-1 rounded">
            {process.env.NEXT_PUBLIC_PUSHER_CLUSTER ? '✅ Set' : '❌ Not set'}
          </code></p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Set up your Pusher account at <a href="https://dashboard.pusher.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://dashboard.pusher.com/</a></li>
          <li>Create a new app and get your credentials</li>
          <li>Add the credentials to your <code>.env.local</code> file</li>
          <li>Restart your development server</li>
          <li>Open this page on two different computers/devices</li>
          <li>Log in with different user accounts on each device</li>
          <li>Send a message from one user to the other</li>
          <li>Check if the message appears in real-time on the receiver&apos;s device</li>
          <li>Monitor the browser console for Pusher events</li>
        </ol>
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Make sure all environment variables are set correctly</li>
          <li>Check that your Pusher app is in the correct cluster</li>
          <li>Verify that your app allows client events if needed</li>
          <li>Check the browser console for any connection errors</li>
          <li>Ensure both devices are accessing the same server instance</li>
        </ul>
      </div>
    </div>
  );
} 