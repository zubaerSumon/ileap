import User from "@/server/db/models/user";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { router } from "@/server/trpc";
import { volunteerValidation } from "./volunteer-profile.valdation";
import Volunteer from "@/server/db/models/volunteer-profile";
import { TRPCError } from "@trpc/server";
import { favoriteOpportunityRouter } from "./favorite-opportunity";

export const volunteerProfileRouter = router({
  updateVolunteerProfile: protectedProcedure
    .input(volunteerValidation.updateVolunteerProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to update this data.",
        });
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      if (input?.name) {
        await User.updateOne(
          { email: sessionUser.email },
          { $set: { name: input.name } }
        );
      }

      const updatedVolunteerProfile = await Volunteer.findByIdAndUpdate(
        user.volunteer_profile,
        { ...input },
        { new: true }
      );

      if (!updatedVolunteerProfile) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Volunteer Profile update failed",
        });
      }

      return updatedVolunteerProfile;
    }),

  getVolunteerProfile: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;
    if (!sessionUser || !sessionUser?.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this data.",
      });
    }

    const user = await User.findOne({ email: sessionUser.email }).populate(
      "volunteer_profile"
    );
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    if (!user.volunteer_profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Volunteer profile not found",
      });
    }

    return {
      name: user.name,
      email: user.email,
      ...user.volunteer_profile._doc,
    };
  }),

  getFavoriteStatus: favoriteOpportunityRouter.getFavoriteStatus,
  toggleFavorite: favoriteOpportunityRouter.toggleFavorite,
  getFavoriteOpportunities: favoriteOpportunityRouter.getFavoriteOpportunities,
});
