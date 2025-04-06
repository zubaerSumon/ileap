import { createTRPCRouter, publicProcedure } from '../index';
import { volunteerSignupSchema } from '@/app/(authLayout)/volunteer-signup/types';
import { organizerSignupSchema } from '@/app/(authLayout)/organizer-signup/types';
import { hash } from 'bcryptjs';
// import mongoose from 'mongoose';
import UserModel, { UserRole } from '@/lib/models/schema';

 
// const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   image: String,
//   emailVerified: Date,
//   role: { type: String, required: true, enum: Object.values(UserRole) },
//   phoneNumber: String,
//   country: String,
//   streetAddress: String,
//   terms: { type: Boolean, required: true },
//   bio: String,
//   age: String,
//   description: String,
//   organizationType: String,
//   abn: String,
//   website: String,
//   volunteerTypes: [String],
//   skills: [String],
//   availabilityDate: {
//     startDate: String,
//     endDate: String,
//   },
//   availabilityTime: {
//     startTime: String,
//     endTime: String,
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// }));

export const authRouter = createTRPCRouter({
  volunteerSignup: publicProcedure
    .input(volunteerSignupSchema)
    .mutation(async ({ input }) => {
      try {

        console.log({input});
        const existingUser = await UserModel.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('Email already registered');
        }

        const hashedPassword = await hash(input.password, 12);

        const user = await UserModel.create({
          ...input,
          password: hashedPassword,
          role: UserRole.VOLUNTEER,
         
        });

        return { success: true, userId: user._id };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Registration failed');
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
