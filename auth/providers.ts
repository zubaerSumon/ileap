import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
 import User from '@/server/db/models/user';
import { ApiError } from '@/lib/exceptions';
import httpStatus from 'http-status';
import { errorHandler } from '@/server/middlewares/error-handler';
import connectDB from '@/server/config/mongoose';

export const CredentialsProvider = Credentials({
  async authorize(credentials) {
    try {
      console.log('credentials from providers', credentials);
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Invalid credentials');
      }

      await connectDB();
      const user = await User.findOne({ email: credentials.email });
       if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      if (user && !user?.is_verified) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Please verify your email first!'
        );
      }

      if (user) {
        console.log('user from isPasswordCorrect block', user);
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error('Invalid email or password. Please try again.');
        }
        if (isPasswordCorrect) {
         
          return user;
        }
      }
      return null;
    } catch (error) {
      const { message } = errorHandler(error);
      console.log('message from credentials', message);
      throw new ApiError(httpStatus.NOT_FOUND, message);
    }
  },
});

export const GoogleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});
