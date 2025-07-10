import User from "@/server/db/models/user";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { router } from "@/server/trpc";
import { z } from "zod";
import { volunteerValidation } from "./volunteer-profile.valdation";
import Volunteer from "@/server/db/models/volunteer-profile";
import { TRPCError } from "@trpc/server";
import { favoriteOpportunityRouter } from "./favorite-opportunity";

export const volunteerProfileRouter = router({
  getVolunteerById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const user = await User.findById(input).populate('volunteer_profile');
      
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Volunteer not found.",
        });
      }

      if (!user.volunteer_profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Volunteer profile not found",
        });
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        ...user.volunteer_profile._doc,
      };
    }),
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

      if (!user.volunteer_profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Volunteer profile not found. Please complete your profile setup first.",
        });
      }

      // Get existing profile to ensure we don't lose required fields
      const existingProfile = await Volunteer.findById(user.volunteer_profile);
      if (!existingProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Volunteer profile not found.",
        });
      }

      // Update user name if provided
      if (input?.name) {
        await User.updateOne(
          { email: sessionUser.email },
          { $set: { name: input.name } }
        );
      }

      // Merge existing required fields with updates
      const updateData = {
        ...existingProfile.toObject(),
        ...input,
        // Ensure required fields are not removed
        bio: input.bio || existingProfile.bio,
        interested_on: input.interested_on !== undefined ? input.interested_on : existingProfile.interested_on,
        interested_categories: input.interested_categories !== undefined ? input.interested_categories : existingProfile.interested_categories,
        phone_number: input.phone_number || existingProfile.phone_number,
        state: input.state || existingProfile.state,
        area: input.area || existingProfile.area,
        postcode: input.postcode || existingProfile.postcode,
      };

      const updatedVolunteerProfile = await Volunteer.findByIdAndUpdate(
        user.volunteer_profile,
        updateData,
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
      image: user.image,
      ...user.volunteer_profile._doc,
    };
  }),

  getFavoriteStatus: favoriteOpportunityRouter.getFavoriteStatus,
  toggleFavorite: favoriteOpportunityRouter.toggleFavorite,
  getFavoriteOpportunities: favoriteOpportunityRouter.getFavoriteOpportunities,
});
