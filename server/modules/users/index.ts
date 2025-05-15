import User from "@/server/db/models/user";
import OrganizationProfile from "@/server/db/models/organization-profile";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { userValidation } from "./users.validation";
import bcrypt from "bcryptjs";
import { publicProcedure, router } from "@/server/trpc";
import VolunteerProfile from "@/server/db/models/volunteer-profile";
import { sendApplicationConfirmationMail } from "@/utils/helpers/sendApplicationConfirmationMail";

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
    console.log("sessionUser", sessionUser);

    const user = await User.findOne({ email: sessionUser.email })
      .populate("volunteer_profile")
      .populate("organization_profile");

    if (!user) {
      throw new Error("User not found.");
    }
    console.log({ user });

    return {
      hasVolunteerProfile: !!user.volunteer_profile,
      hasOrganizationProfile: !!user.organization_profile,
      volunteerProfile: user.volunteer_profile,
      organizationProfile: user.organization_profile,
    };
  }),

  setupVolunteerProfile: protectedProcedure
    .input(userValidation.volunteerSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new Error("You must be logged in to setup your profile.");
      }

      const volunteerProfile = await VolunteerProfile.create({
        ...input,
      });

      if (!volunteerProfile) {
        throw new Error("Failed to create volunteer profile");
      }

      return volunteerProfile;
    }),

  setupOrgProfile: protectedProcedure
    .input(userValidation.organizationSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new Error("You must be logged in to setup your profile.");
      }

      const organizationProfile = await OrganizationProfile.create({
        ...input,
      });

      if (!organizationProfile) {
        throw new Error("Failed to create organization profile");
      }

      return organizationProfile;
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

      const volunteer = await VolunteerProfile.findOne({
        user: sessionUser.id,
      });
      if (!volunteer) {
        throw new Error("Volunteer profile not found.");
      }

      const alreadyApplied = volunteer.applied_events?.includes(input.eventId);
      if (alreadyApplied) {
        return {
          success: true,
          message: "Already applied to this event",
          alreadyApplied: true,
        };
      }

      const updatedVolunteer = await VolunteerProfile.findOneAndUpdate(
        { user: sessionUser.id },
        { $addToSet: { applied_events: input.eventId } },
        { new: true }
      );

      if (!updatedVolunteer) {
        throw new Error("Failed to apply for the event");
      }
      sendApplicationConfirmationMail(
        sessionUser.email,
        sessionUser.name,
        input.eventId
      );
      return {
        success: true,
        message: "Successfully applied to the event",
        alreadyApplied: false,
      };
    }),
});
