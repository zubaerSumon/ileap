import type { NextAuthConfig } from 'next-auth';
import { CredentialsProvider, GoogleProvider } from './providers';

export const authConfig = {
  providers: [CredentialsProvider, GoogleProvider],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
