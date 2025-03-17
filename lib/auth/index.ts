import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { UserRole } from "../models/schema";
import type { DefaultSession, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import clientPromise from "@/lib/mongodb";


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: typeof UserRole[keyof typeof UserRole];
    } & DefaultSession["user"];
  }

  interface User {
    role: typeof UserRole[keyof typeof UserRole];
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: typeof UserRole[keyof typeof UserRole];
  }
}

const authOptions = {
  providers: [],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ 
      session, 
      user 
    }: { 
      session: Session; 
      user: User;
    }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      };
    },
    async jwt({ 
      token, 
      user 
    }: { 
      token: JWT; 
      user: User | undefined;
    }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "fallback-secret-key-for-development-only",
};

export const auth = NextAuth(authOptions);