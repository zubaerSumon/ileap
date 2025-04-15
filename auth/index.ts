import NextAuth, { Session } from "next-auth";
import connectToDatabase from "@/server/config/mongoose";
import User from "@/server/db/models/user";
import { authConfig } from "./config";
import { JWT } from "next-auth/jwt";
//import { UserRole } from "@/server/db/interfaces/user";
 
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
          
          // Redirect based on existing user's role
          if (existingUser.role) {
            return `/${existingUser.role.toLowerCase()}`;
          }
          return "/set-role";
        } catch (err) {
          console.error("Error during Google sign-in:", err);
          return false;
        }
      }

      if (account?.provider === "credentials") {
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            throw new Error("User not found");
          }
          
          if (existingUser.role) {
            return `/${existingUser.role.toLowerCase()}`;
          }
          return "/set-role";
        } catch (error) {
          console.error("Error during credentials sign-in:", error);
          throw error;
        }
      }

      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "signIn" || (trigger === "update" && session)) {
        const retrievedUser = await User.findOne({ email: user?.email });
        console.log("____retrievedUser", retrievedUser);

        if (retrievedUser) {
          token.id = retrievedUser.id;
          token.email = retrievedUser.email;
          token.name = retrievedUser.name || user?.name;
          token.role = retrievedUser?.role || "";
        }
      }

      console.log("____token", token);
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      console.log("____session", session);
      
      return {
        ...session,

        user: {
          id: token.id as string,
          email: token.email as string,
          name: (token.name as string) || (token.name as string) || "",
        },
      };
    },
  },
  ...authConfig,
});
