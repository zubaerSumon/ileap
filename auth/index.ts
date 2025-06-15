import NextAuth from "next-auth";
import connectToDatabase from "@/server/config/mongoose";
import User from "@/server/db/models/user";
import { authConfig } from "./config";

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
    signIn: "/signin",
  },

  callbacks: {
    async signIn({ user, account }) {
      await connectToDatabase();

      if (account?.provider === "google") {
        try {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              name: user.name,
              provider: "google",
              is_verified: true,
            });
            await newUser.save();
            return true;
          }

          return true;
        } catch (err) {
          console.error("Error during Google sign-in:", err);
          return false;
        }
      }

      if (account?.provider === "credentials") {
       return true
      }

      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'signIn' || (trigger === 'update' && session)) {
        const retrievedUser = await User.findOne({ email: user?.email || token.email })
          .populate("organization_profile");
        
        if (retrievedUser) {
          token.id = retrievedUser.id;
          token.email = retrievedUser.email;
          token.name = retrievedUser.name || user?.name;
          token.role = retrievedUser.role || '';
          token.organization_profile = retrievedUser.organization_profile;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (!token) {
        return {
          ...session,
          user: {
            id: '',
            email: '',
            name: '',
            role: '',
          },
        };
      }
      
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name || user?.name,
          role: token.role || '',
          organization_profile: token.organization_profile,
        },
      };
    },
  },
  ...authConfig,
});
