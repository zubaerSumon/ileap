import NextAuth from "next-auth";
import connectToDatabase from "@/server/config/mongoose";
import User from "@/server/db/models/user";
import { authConfig } from "./config";
import { opportunityArchiver } from "@/server/services/opportunity-archiver";

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
      await connectToDatabase();

      // Run opportunity archiving on login
      try {
        await opportunityArchiver.manualArchive();
      } catch {
        // Silent error handling for archiving
      }

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
    async jwt({ token, user, trigger }) {
      console.log('JWT callback triggered:', { trigger, hasToken: !!token, hasUser: !!user });
      
      // Always fetch the latest user data to ensure profile updates are reflected
      if (token.email) {
        try {
          // Ensure database connection is established
          await connectToDatabase();
          
          const retrievedUser = await User.findOne({ email: token.email })
            .populate("organization_profile")
            .maxTimeMS(5000); // 5 second timeout
          
          if (retrievedUser) {
            token.id = retrievedUser.id;
            token.email = retrievedUser.email;
            token.name = retrievedUser.name;
            token.role = retrievedUser.role || '';
            token.image = retrievedUser.image;
            token.organization_profile = retrievedUser.organization_profile;
            
            console.log('JWT callback - Updated token with fresh user data:', {
              name: retrievedUser.name,
              image: retrievedUser.image,
              email: retrievedUser.email
            });
          }
        } catch (error) {
          console.error('Error fetching user data in JWT callback:', error);
          // Don't throw the error, just log it and continue with existing token data
        }
      }
      
      // Handle initial sign in
      if (trigger === 'signIn' && user) {
        try {
          // Ensure database connection is established
          await connectToDatabase();
          
          const retrievedUser = await User.findOne({ email: user.email })
            .populate("organization_profile")
            .maxTimeMS(5000); // 5 second timeout
          
          if (retrievedUser) {
            token.id = retrievedUser.id;
            token.email = retrievedUser.email;
            token.name = retrievedUser.name || user.name;
            token.role = retrievedUser.role || '';
            token.image = retrievedUser.image;
            token.organization_profile = retrievedUser.organization_profile;
            
            console.log('JWT callback - Initial sign in with user data:', {
              name: retrievedUser.name,
              image: retrievedUser.image,
              email: retrievedUser.email
            });
          }
        } catch (error) {
          console.error('Error fetching user data on sign in:', error);
          // Don't throw the error, just log it and continue with existing token data
        }
      }
      
      // Handle session update
      if (trigger === 'update') {
        console.log('JWT callback - Update trigger received');
        // The session update should trigger a fresh fetch of user data
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback triggered:', { hasToken: !!token, hasSession: !!session });
      
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
      
      const sessionUser = {
        id: typeof token.id === 'string' ? token.id : '',
        email: typeof token.email === 'string' ? token.email : '',
        name: typeof token.name === 'string' ? token.name : '',
        role: typeof token.role === 'string' ? token.role : '',
        image: typeof token.image === 'string' ? token.image : null,
        organization_profile: token.organization_profile,
      };
      
      console.log('Session callback - Creating session with user data:', {
        name: sessionUser.name,
        image: sessionUser.image,
        email: sessionUser.email
      });
      
      return {
        ...session,
        user: sessionUser,
      };
    },
  },
  ...authConfig,
});
