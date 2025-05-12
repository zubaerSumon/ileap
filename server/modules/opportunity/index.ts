import { router } from "@/server/trpc";
import { opportunityValidation } from "./opportunities.validation";
import { TRPCError } from "@trpc/server";
import Opportunity from "@/server/db/models/opportunity";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import Organization from "@/server/db/models/organization";
import { z } from "zod";

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

      // Verify organization exists and belongs to the user
      const organization = await Organization.findOne({
        _id: input.organization,
        user: sessionUser.id
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found or you don't have permission to create opportunities for it",
        });
      }

      try {
        const opportunity = await Opportunity.create({
          ...input,
          date: {
            start_date: new Date(input.date.start_date),
            end_date: input.date.end_date ? new Date(input.date.end_date) : undefined
          },
          recurrence: input.recurrence ? {
            ...input.recurrence,
            date_range: {
              start_date: new Date(input.recurrence.date_range.start_date),
              end_date: input.recurrence.date_range.end_date ? new Date(input.recurrence.date_range.end_date) : undefined
            }
          } : undefined
        });

        return opportunity;
      } catch (error) {
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
        const organization = await Organization.findOne({ user: sessionUser.id });
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
    })
}); 