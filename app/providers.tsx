'use client';

import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "./providers/TRPCProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </TRPCProvider>
  );
}