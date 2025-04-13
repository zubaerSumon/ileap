
import { volunteerSignupSchema } from '@/app/(auth)/volunteer-signup/types';
import { organizerSignupSchema } from '@/app/(auth)/organizer-signup/types';
import { hash } from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import UserModel, { UserRole } from '@/lib/models/user';
import User from '@/lib/models/user';
import { publicProcedure, router } from './trpc';

export const authRouter = router({
  volunteerSignup: publicProcedure
    .input(volunteerSignupSchema)
    .mutation(async ({ input }) => {
      try {
        // const db = await connectDB();
        // if (!db) throw new Error('Database connection failed');
        console.log("input: ", input)
        const existingUser = await User.findOne({ email: input.email }).exec();

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already registered'
          });
        }

        const hashedPassword = await hash(input.password, 12);

        // Create volunteer profile structure
        const volunteerData = {
          email: input.email,
          password: hashedPassword,
          role: UserRole.VOLUNTEER,
          terms: input.terms,
          volunteer_profile: {
            name: input.name,
            skills: input.skills || '',
            age: input.age || '',
            phone_number: input.phone_number || '',
            country: input.country || '',
            street_address: input.street_address || '',
            bio: input.bio || '',
            availability_date: input.availability_date || '',
            availability_time: input.availability_time || '',
          }
        };

        const user = await UserModel.create(volunteerData);
        
        if (!user) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create user'
          });
        }

        return { success: true, userId: user._id };
      } catch (error) {
        console.error('Volunteer signup error:', error);
        
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Registration failed',
          cause: error
        });
      }
    }),

  organizerSignup: publicProcedure
    .input(organizerSignupSchema)
    .mutation(async ({ input }) => {
      try {
        const existingUser = await UserModel.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('Email already registered');
        }

        const hashedPassword = await hash(input.password, 12);

        // Handle file upload if needed
        const imageUrl = undefined;
        if (input.organizationLogo?.[0]) {
          // TODO: Implement file upload logic
          // imageUrl = await uploadFile(input.organizationLogo[0]);
        }

        const user = await UserModel.create({
          email: input.email,
          password: hashedPassword,
          name: input.organizationName,
          description: input.organizationDescription,
          phoneNumber: input.organizationPhone,
          website: input.website,
          image: imageUrl,
          role: UserRole.ORGANIZATION,
          terms: input.termsAccepted,
          country: input.location,
        });

        return { success: true, userId: user._id };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Registration failed');
      }
    }),
});
