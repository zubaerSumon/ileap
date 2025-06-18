"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, wsLink, splitLink } from "@trpc/client";
import React, { useState } from "react";
import { getBaseUrl, trpc } from "./client";
import { createWSClient } from "@trpc/client";

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    if (typeof window === 'undefined') {
      // Server-side: only use HTTP
      return trpc.createClient({
        links: [
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        ],
      });
    }

    // Client-side: use WebSocket for subscriptions, HTTP for queries/mutations
    const wsClient = createWSClient({
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    });

    return trpc.createClient({
      links: [
        splitLink({
          condition: (op) => {
            return op.type === 'subscription';
          },
          true: wsLink({
            client: wsClient,
          }),
          false: httpBatchLink({
            url: '/api/trpc',
          }),
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
