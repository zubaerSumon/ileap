import { publicProcedure, router } from "@/server/trpc";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import User from "@/server/db/models/user";
import VolunteerApplication from "@/server/db/models/volunteer-application";
import Opportunity from "@/server/db/models/opportunity";
import FavoriteOpportunity from "@/server/db/models/favorite-opportunity";
import connectDB from "@/server/config/mongoose";
import { sendApplicationConfirmationMail } from "@/utils/helpers/sendApplicationConfirmationMail";
import { volunteerApplicationValidation } from "./volunteer-application.validation";

export const volunteerApplicationRouter = router({
  getApplicationStatus: protectedProcedure
    .input(volunteerApplicationValidation.getApplicationStatusSchema)
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

        const application = (await VolunteerApplication.findOne({
          opportunity: input.opportunityId,
          volunteer: user.volunteer_profile,
        }).lean()) as { status?: string } | null;

        return { status: application?.status || null };
      } catch (error) {
        console.error("Error getting application status:", error);
        return { status: null };
      }
    }),

  getVolunteerApplications: publicProcedure.query(async () => {
    try {
      const applications = await VolunteerApplication.find()
        .select("opportunity status")
        .lean();
      return applications;
    } catch (error) {
      console.error("Error fetching volunteer applications:", error);
      return [];
    }
  }),

  applyToOpportunity: protectedProcedure
    .input(volunteerApplicationValidation.applyToOpportunitySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await connectDB();

        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser || !sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to apply for opportunities.",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user || !user.volunteer_profile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Volunteer profile not found.",
          });
        }

        const opportunity = await Opportunity.findById(input.opportunityId);
        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found.",
          });
        }

        const existingApplication = await VolunteerApplication.findOne({
          opportunity: input.opportunityId,
          volunteer: user.volunteer_profile,
        });

        if (existingApplication) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have already applied for this opportunity.",
          });
        }

        const application = await VolunteerApplication.create({
          opportunity: input.opportunityId,
          volunteer: user.volunteer_profile,
        });

        if (!application) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to apply for opportunity.",
          });
        }
        sendApplicationConfirmationMail(
          sessionUser.email,
          sessionUser.name,
          input.opportunityId
        );
        return application;
      } catch (error) {
        console.error("Error in applyToOpportunity:", error);
        throw error;
      }
    }),

  getFavoriteStatus: protectedProcedure
    .input(volunteerApplicationValidation.getApplicationStatusSchema)
    .query(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          return { isFavorite: false };
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          return { isFavorite: false };
        }

        const favorite = await FavoriteOpportunity.findOne({
          user: user._id,
          opportunity: input.opportunityId,
        });

        return {
          isFavorite: !!favorite,
        };
      } catch (error) {
        console.error("Error getting favorite status:", error);
        return { isFavorite: false };
      }
    }),

  toggleFavorite: protectedProcedure
    .input(volunteerApplicationValidation.applyToOpportunitySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to toggle favorites.",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }

        const favorite = await FavoriteOpportunity.findOne({
          user: user._id,
          opportunity: input.opportunityId,
        });

        if (favorite) {
          await FavoriteOpportunity.deleteOne({
            user: user._id,
            opportunity: input.opportunityId,
          });
          return { isFavorite: false };
        } else {
          await FavoriteOpportunity.create({
            user: user._id,
            opportunity: input.opportunityId,
          });
          return { isFavorite: true };
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
      }
    }),
}); 