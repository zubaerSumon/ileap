import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import UserModel, {  UserRole } from "../models/user";
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

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
 
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await UserModel.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
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