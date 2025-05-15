import { router } from "@/server/trpc";
import { opportunityValidation } from "./opportunities.validation";
import { TRPCError } from "@trpc/server";
import Opportunity from "@/server/db/models/opportunity";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import OrganizationProfile from "@/server/db/models/organization-profile";
import { z } from "zod";
import User from "@/server/db/models/user";

export const opportunityRouter = router({
  createOpportunity: protectedProcedure
    .input(opportunityValidation.createOpportunitySchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create an opportunity",
        });
      }

      const user = await User.findById(sessionUser.id);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!user.organization_profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization profile not found. Please complete your organization profile first.",
        });
      }

      try {
        const opportunityData = {
          ...input,
          organization_profile: user.organization_profile,
          created_by: sessionUser.id,
          date: {
            start_date: input.date.start_date,
            end_date: input.date.end_date
          },
          banner_img: input.banner_img || undefined
        };

        if (input.recurrence) {
          opportunityData.recurrence = {
            ...input.recurrence,
            date_range: {
              start_date: input.recurrence.date_range.start_date,
              end_date: input.recurrence.date_range.end_date
            }
          };
        }

        const opportunity = await Opportunity.create(opportunityData);
        return opportunity;
      } catch (error) {
        console.error('Opportunity creation error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create opportunity",
          cause: error,
        });
      }
    }),

  getOpportunity: protectedProcedure
    .input(z.string())
    .query(async ({ input: opportunityId }) => {
      try {
        const opportunity = await Opportunity.findById(opportunityId)
          .populate({
            path: "organization",
            select: "name email phone_number",
          });

        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found",
          });
        }

        return opportunity;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch opportunity",
          cause: error,
        });
      }
    }),

  getOrganizationOpportunities: protectedProcedure
    .query(async ({ ctx }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view opportunities",
        });
      }

      try {
        const organization = await OrganizationProfile.findOne({ user: sessionUser.id });
        if (!organization) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organization profile not found",
          });
        }

        const opportunities = await Opportunity.find({ organization: organization._id })
          .sort({ createdAt: -1 });

        return opportunities;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch opportunities",
          cause: error,
        });
      }
    }),

  getAllOpportunities: protectedProcedure
    .query(async () => {
      try {
        const opportunities = await Opportunity.find()
          .populate({
            path: "organization_profile", 
          })
          .sort({ createdAt: -1 });

        return opportunities;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch opportunities",
          cause: error,
        });
      }
    })
}); 