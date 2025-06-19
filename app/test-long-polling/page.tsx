"use client";

import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function TestSSESubscriptions() {
  const { data: session } = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("Not started");
  const [lastUpdate, setLastUpdate] = useState<string>("Never");
  const [messageCount, setMessageCount] = useState<number>(0);
  const [conversationCount, setConversationCount] = useState<number>(0);

  // SSE subscription for messages
  const messageSubscription = trpc.messages.subscribeToMessages.useSubscription(
    { userId: undefined, isGroup: false },
    {
      enabled: !!session?.user?.id,
      onData: (data) => {
        setLastUpdate(new Date().toISOString());
        setMessageCount(prev => prev + 1);
        
        if (data.type === 'connected') {
          setSubscriptionStatus('Connected to message subscription');
        } else if (data.type === 'new_message') {
          setSubscriptionStatus(`New message received! Total: ${messageCount + 1}`);
        } else if (data.type === 'message_read') {
          setSubscriptionStatus(`Message read event! Total: ${messageCount + 1}`);
        } else if (data.type === 'conversation_update') {
          setSubscriptionStatus(`Conversation update! Total: ${messageCount + 1}`);
        }
      },
      onError: (error) => {
        setSubscriptionStatus(`Error: ${error.message}`);
      },
    }
  );

  // SSE subscription for conversations
  const conversationSubscription = trpc.messages.subscribeToConversations.useSubscription(
    undefined,
    {
      enabled: !!session?.user?.id,
      onData: (data) => {
        setLastUpdate(new Date().toISOString());
        setConversationCount(prev => prev + 1);
        
        if (data.type === 'connected') {
          setSubscriptionStatus('Connected to conversation subscription');
        } else if (data.type === 'conversation_update') {
          setSubscriptionStatus(`Conversation update! Total: ${conversationCount + 1}`);
        } else if (data.type === 'group_update') {
          setSubscriptionStatus(`Group update! Total: ${conversationCount + 1}`);
        }
      },
      onError: (error) => {
        setSubscriptionStatus(`Error: ${error.message}`);
      },
    }
  );

  if (!session) {
    return <div className="p-8">Please sign in to test SSE subscriptions</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SSE Subscriptions Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Status</h2>
          <p>{subscriptionStatus}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Last Update</h2>
          <p>{lastUpdate}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">User Info</h2>
          <p>ID: {session.user.id}</p>
          <p>Email: {session.user.email}</p>
        </div>

        <div className="p-4 bg-green-100 rounded">
          <h2 className="font-semibold">Subscription Stats</h2>
          <p>Message Events: {messageCount}</p>
          <p>Conversation Events: {conversationCount}</p>
          <p>Message Subscription Status: {messageSubscription.status}</p>
          <p>Conversation Subscription Status: {conversationSubscription.status}</p>
        </div>

        <div className="p-4 bg-blue-100 rounded">
          <h2 className="font-semibold">Instructions</h2>
          <p>This page tests the SSE subscription implementation. Open another browser tab and send a message to see if the subscriptions detect the updates in real-time.</p>
          <p className="mt-2 text-sm text-gray-600">
            SSE subscriptions provide true real-time updates with minimal server load compared to polling.
          </p>
        </div>
      </div>
    </div>
  );
} 