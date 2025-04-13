/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '@/server/db/models/user';
import httpStatus from 'http-status';
import { protectedProcedure } from '@/server/middlewares/with-auth';
 import { JwtPayload } from 'jsonwebtoken';
import { userValidation } from './users.validation';
 import { errorHandler } from '@/server/middlewares/error-handler';
import { ApiError } from '@/lib/exceptions';
import bcrypt from 'bcryptjs';
import { router } from '@/server/routers/trpc';

 
export const userRouter = router({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const loggedUser = ctx.user as JwtPayload;
    const users = await User.find({});

    return {
      users,
      loggedUser,
    };
  }),

  getUserByEmail: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessionUser = ctx.user as JwtPayload;

      if (!sessionUser || !sessionUser.id) {
        throw new Error('You must be logged in to access this data.');
      }

      const user = await User.findOne({
        $or: [{ _id: sessionUser.id }, { email: sessionUser.email }],
      });

      if (!user) {
        throw new Error('User not found');
      }

      return sessionUser?.audit_for ? { ...user._doc, role: 'auditor' } : user;
    } catch (error) {
      console.log('error from get user by email', error);
      const { message } = errorHandler(error);
      throw new ApiError(httpStatus.NOT_FOUND, message);
    }
  }),
  updateUserAvatar: protectedProcedure
    .input(userValidation.updateUserAvatarSchema)
    .mutation(async ({ ctx, input }) => {
      const { image } = input;
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error('You must be logged in to update your avatar.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      user.image = image;
      await user.save();

      return user;
    }),
  updateUser: protectedProcedure
    .input(userValidation.updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { questionnaires = [], isSawInstructions = false } = input;

      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error('You must be logged in to update this data.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      const existingQuestionnaires = user.questionnaires || [];

      const mergedQuestionnaires = questionnaires.map(
        (payloadQuestionnaire) => {
          const existingQuestionnaire = existingQuestionnaires.find(
            (q: any) => q.question === payloadQuestionnaire.question
          );

          if (existingQuestionnaire) {
            const updatedAnswers = payloadQuestionnaire.answers.map(
              (payloadAnswer) => {
                const existingAnswer = existingQuestionnaire.answers.find(
                  (answer: any) => Object.keys(answer)[0] === payloadAnswer
                );

                if (existingAnswer) {
                  return existingAnswer;
                }
                return { [payloadAnswer]: [] };
              }
            );

            return {
              question: payloadQuestionnaire.question,
              answers: updatedAnswers,
            };
          }

          return {
            question: payloadQuestionnaire.question,
            answers: payloadQuestionnaire.answers.map((answer) => ({
              [answer]: [],
            })),
          };
        }
      );

      const preservedQuestionnaires = existingQuestionnaires.filter(
        (existingQuestionnaire: any) =>
          !questionnaires.some(
            (payloadQuestionnaire) =>
              payloadQuestionnaire.question === existingQuestionnaire.question
          )
      );

      const finalQuestionnaires = [
        ...mergedQuestionnaires,
        ...preservedQuestionnaires,
      ];

      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        {
          questionnaires: finalQuestionnaires,
          isStepperSkippedOrCompleted: true,
          isSawInstructions,
        },

        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User update failed');
      }

      return updatedUser;
    }),
  updateUserPersonalInfo: protectedProcedure
    .input(userValidation.updateUserPersonalInfoSchema)
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, profile } = input;
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error(
          'You must be logged in to update your personal information.'
        );
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.profile = profile;
      await user.save();

      return user;
    }),
  updateUserPassword: protectedProcedure
    .input(userValidation.updateUserPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { oldPassword, newPassword } = input;
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error('You must be logged in to update your password.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Current password you provided is incorrect!');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return { message: 'Password updated successfully.' };
    }),
 
 
});
