"use client";

import { useGlobalSSE } from '@/hooks/useGlobalSSE';

export const GlobalSSEProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize global SSE connection (hook handles client-side checks internally)
  useGlobalSSE();
  
  return <>{children}</>;
}; 