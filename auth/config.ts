 import type { NextAuthConfig } from 'next-auth';
import { CredentialsProvider, GoogleProvider } from './providers';

export const authConfig = {
  providers: [CredentialsProvider, GoogleProvider],
} satisfies NextAuthConfig;
