import User from "@/server/db/models/user";
import Organization from "@/server/db/models/organization";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { userValidation } from "./users.validation";
import bcrypt from "bcryptjs";
import { publicProcedure, router } from "@/server/trpc";
import Volunteer from "@/server/db/models/volunteer";

export const userRouter = router({
  updateUser: protectedProcedure
    .input(userValidation.updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error("You must be logged in to update this data.");
      }

      const user = await User.findOne({ email: sessionUser.email });

      if (!user) {
        throw new Error("User not found.");
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { ...input },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User update failed");
      }

      return updatedUser;
    }),

  profileCheckup: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;
    if (!sessionUser || !sessionUser?.id) {
      throw new Error("You must be logged in to check profile.");
    }

    const [volunteer, organization] = await Promise.all([
      Volunteer.findOne({ user: sessionUser.id }),
      Organization.findOne({ user: sessionUser.id }),
    ]);

    return {
      hasVolunteerProfile: !!volunteer,
      hasOrganizationProfile: !!organization,
      volunteerProfile: volunteer,
      organizationProfile: organization,
    };
  }),

  setupVolunteerProfile: protectedProcedure
    .input(userValidation.volunteerSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new Error("You must be logged in to setup your profile.");
      }

      const existingProfile = await Volunteer.findOne({ user: sessionUser.id });
      if (existingProfile) {
        throw new Error("Profile already exists.");
      }

      const volunteer = await Volunteer.create({
        ...input,
        user: sessionUser.id,
      });

      if (!volunteer) {
        throw new Error("Failed to create volunteer profile");
      }

      return volunteer;
    }),

  setupOrgProfile: protectedProcedure
    .input(userValidation.organizationSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new Error("You must be logged in to setup your profile.");
      }

      const existingProfile = await Organization.findOne({
        user: sessionUser.id,
      });
      if (existingProfile) {
        throw new Error("Organization profile already exists.");
      }

      const organization = await Organization.create({
        ...input,
        user: sessionUser.id,
      });

      if (!organization) {
        throw new Error("Failed to create organization profile");
      }

      return organization;
    }),

  resetPassword: publicProcedure
    .input(userValidation.resetPasswordSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new Error(
          "No account found with this email address. Please check and try again."
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Password reset failed. Please try again.");
      }

      return {
        success: true,
        message: "Password has been successfully reset",
      };
    }),

  applyToEvent: protectedProcedure
    .input(userValidation.applyToEventSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new Error("You must be logged in to apply for events.");
      }

      const volunteer = await Volunteer.findOne({ user: sessionUser.id });
      if (!volunteer) {
        throw new Error("Volunteer profile not found.");
      }

      // Check if already applied
      const alreadyApplied = volunteer.applied_events?.includes(input.eventId);
      if (alreadyApplied) {
        return {
          success: true,
          message: "Already applied to this event",
          alreadyApplied: true,
        };
      }

      // Add the event ID to applied_events array
      const updatedVolunteer = await Volunteer.findOneAndUpdate(
        { user: sessionUser.id },
        { $addToSet: { applied_events: input.eventId } },
        { new: true }
      );

      if (!updatedVolunteer) {
        throw new Error("Failed to apply for the event");
      }

      return {
        success: true,
        message: "Successfully applied to the event",
        alreadyApplied: false,
      };
    }),
});
