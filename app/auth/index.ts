import NextAuth, { Session } from "next-auth";
import connectToDatabase from "@/server/config/mongoose";
import User from "@/server/db/models/user";
 import { authConfig } from "./config";
import { JWT } from "next-auth/jwt";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              firstName: user.name,
              lastName: "",
              role: "customer",
              provider: "google",
              image: user?.image || "",
              isVerified: true,
            });
            await newUser.save();
          }
          return true;
        } catch (err) {
          console.error("Error saving user during Google sign-in", err);
          return false;
        }
      }

      if (account?.provider === "credentials") {
        return true;
      }

      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "signIn" || (trigger === "update" && session)) {
        const retrievedUser = await User.findOne({ email: user?.email });

        if (retrievedUser) {
          token.id = retrievedUser.id;
          token.email = retrievedUser.email;
          token.firstName = retrievedUser.firstName || user?.name;
          token.lastName = retrievedUser.lastName;
          token.role = retrievedUser.role || "customer";
          token.hasAnswers = retrievedUser.isStepperSkippedOrCompleted;
          token.isSawInstructions = retrievedUser.isSawInstructions;
        }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      return {
        ...session,
        user: {
          id: token.id as string,
          email: token.email as string,
          name: (token.firstName as string) || (token.name as string) || "",
        },
      };
    },
  },
  ...authConfig,
});
