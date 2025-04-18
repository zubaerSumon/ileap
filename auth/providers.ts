import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import User from "@/server/db/models/user";
import { ApiError } from "@/lib/exceptions";
import httpStatus from "http-status";
import { errorHandler } from "@/server/middlewares/error-handler";
import connectDB from "@/server/config/mongoose";
import { UserRole } from "@/server/db/interfaces/user";

export const CredentialsProvider = Credentials({
  async authorize(credentials) {
    try {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Invalid credentials");
      }

      await connectDB();
      const user = await User.findOne({ email: credentials.email });

      if (credentials?.action === "signin") {
        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found. Please sign up first.");
        }

        if (!user?.is_verified) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Please verify your email first!");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password. Please try again.");
        }

        return { ...user.toObject(), message: "Logged in successfully" };
      }

      if (credentials?.action === "signup") {
        if (user) {
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          
          if (isPasswordCorrect) {
            return { ...user.toObject(), message: "Logged in successfully" };
          }
          throw new ApiError(httpStatus.CONFLICT, "User already exists with different password");
        }

        const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
        const newUser = await User.create({
          email: credentials.email,
          name: credentials.name,
          password: hashedPassword,
          referred_by: credentials.referred_by,
          role: UserRole.VOLUNTEER,
          is_verified: true,
        });

        return { ...newUser.toObject(), message: "Registered successfully" };
      }

      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid action specified");
    } catch (error) {
      const { message } = errorHandler(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
    }
  },
});

export const GoogleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});
