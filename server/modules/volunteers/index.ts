import User from "@/server/db/models/user";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { publicProcedure, router } from "@/server/trpc";
import { volunteerValidation } from "./volunteers.valdation";
import connectDB from "@/server/config/mongoose";
import mongoose from "mongoose";
import Volunteer from "@/server/db/models/volunteer-profile";

export const volunteerRouter = router({
  updateVolunteerProfile: protectedProcedure
    .input(volunteerValidation.updateVolunteerProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error("You must be logged in to update this data.");
      }

      const user = await User.findOne({ email: sessionUser.email });

      if (!user) {
        throw new Error("User not found.");
      }

      if (input?.name) {
        await User.updateOne(
          { email: sessionUser.email },
          { $set: { name: input.name } }
        );
      }

      const updatedVolunteerProfile = await Volunteer.findOneAndUpdate(
        { user: sessionUser.id },
        { ...input },
        { new: true }
      );

      if (!updatedVolunteerProfile) {
        throw new Error("Volunteer Profile update failed");
      }

      return updatedVolunteerProfile;
    }),
  getVolunteerProfile: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;
    if (!sessionUser || !sessionUser?.email) {
      throw new Error("You must be logged in to update this data.");
    }

    const user = await User.findOne({ email: sessionUser.email });

    if (!user) {
      throw new Error("User not found.");
    }

    const volunteerProfile = await Volunteer.findOne({ user: sessionUser.id });
    if (!volunteerProfile) {
      throw new Error("Volunteer profile not found");
    }

    return {
      name: user.name,
      ...volunteerProfile._doc,
    };
  }),
  getVolunteersWithAppliedEvents: publicProcedure
    .input(volunteerValidation.getVolunteersWithAppliedEventsSchema)
    .query(async ({ input }) => {
      try {
         await connectDB();
        
         if (!mongoose.models.user) {
          await import("@/server/db/models/user");
        }
        if (!mongoose.models.volunteer) {
          await import("@/server/db/models/volunteer-profile");
        }

        const volunteers = await Volunteer.find({
          applied_events: input.eventId
        })
          .populate({
            path: "user",
            select: "name email",
          })
          .lean();

        return volunteers || [];
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        throw new Error("Failed to fetch volunteers");
      }
    }),
});
