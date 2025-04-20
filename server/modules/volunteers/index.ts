import User from "@/server/db/models/user";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";

import { router } from "@/server/trpc";
import { volunteerValidation } from "./volunteers.valdation";
import { Volunteer } from "@/server/db/models/volunteer";

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
    getVolunteerProfile: protectedProcedure
    .query(async ({ ctx }) => {
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
});

