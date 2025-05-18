import User from "@/server/db/models/user";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { publicProcedure, router } from "@/server/trpc";
import { volunteerValidation } from "./volunteer-profile.valdation";
import connectDB from "@/server/config/mongoose";
import Volunteer from "@/server/db/models/volunteer-profile";
import VolunteerApplication from "@/server/db/models/volunteer-application";
import Opportunity from "@/server/db/models/opportunity";

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

      const updatedVolunteerProfile = await Volunteer.findByIdAndUpdate(
        user.volunteer_profile,
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
      throw new Error("You must be logged in to access this data.");
    }

    const user = await User.findOne({ email: sessionUser.email }).populate(
      "volunteer_profile"
    );
    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.volunteer_profile) {
      throw new Error("Volunteer profile not found");
    }

    return {
      name: user.name,
      email: user.email,
      ...user.volunteer_profile._doc,
    };
  }),

  getApplicationStatus: protectedProcedure
    .input(volunteerValidation.getApplicationStatusSchema)
    .query(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          return { status: null };
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user?.volunteer_profile) {
          return { status: null };
        }

        const application = await VolunteerApplication.findOne({
          opportunity: input.opportunityId,
          volunteer: user.volunteer_profile,
        }).lean() as { status?: string } | null;

        return { status: application?.status || null };
      } catch (error) {
        console.error("Error getting application status:", error);
        return { status: null };
      }
    }),

  getVolunteerApplications: publicProcedure
    .query(async () => {
      try {
        const applications = await VolunteerApplication.find()
          .select('opportunity status')
          .lean();
        return applications;
      } catch (error) {
        console.error("Error fetching volunteer applications:", error);
        return [];
      }
    }),

  applyToOpportunity: protectedProcedure
    .input(volunteerValidation.applyToOpportunitySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure database connection
        await connectDB();

        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser || !sessionUser?.email) {
          throw new Error("You must be logged in to apply for opportunities.");
        }

        console.log("Applying for opportunity:", {
          email: sessionUser.email,
          opportunityId: input.opportunityId,
        });

        const user = await User.findOne({ email: sessionUser.email });
        if (!user || !user.volunteer_profile) {
          throw new Error("Volunteer profile not found.");
        }

        console.log("Found user:", {
          userId: user._id,
          volunteerProfileId: user.volunteer_profile,
        });

        // Check if opportunity exists
        const opportunity = await Opportunity.findById(input.opportunityId);
        if (!opportunity) {
          throw new Error("Opportunity not found.");
        }

        console.log("Found opportunity:", {
          opportunityId: opportunity._id,
        });

        // Check if already applied
        const existingApplication = await VolunteerApplication.findOne({
          opportunity: input.opportunityId,
          volunteer: user.volunteer_profile,
        });

        if (existingApplication) {
          throw new Error("You have already applied for this opportunity.");
        }

        // Create new application
        const application = await VolunteerApplication.create({
          opportunity: input.opportunityId,
          volunteer: user.volunteer_profile,
        });

        console.log("Created application:", {
          applicationId: application._id,
          status: application.status,
        });

        return application;
      } catch (error) {
        console.error("Error in applyToOpportunity:", error);
        throw error;
      }
    }),
});
