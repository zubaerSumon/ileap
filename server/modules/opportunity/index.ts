import { router } from "@/server/trpc";
import { opportunityValidation } from "./opportunities.validation";
import { TRPCError } from "@trpc/server";
import Opportunity from "@/server/db/models/opportunity";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import User from "@/server/db/models/user";
import VolunteerApplication from "@/server/db/models/volunteer-application";
import OrganisationRecruitment from "@/server/db/models/organisation-recruitment";

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
          message:
            "Organization profile not found. Please complete your organization profile first.",
        });
      }

      try {
        const opportunityData = {
          ...input,
          organization_profile: user.organization_profile,
          created_by: sessionUser.id,
          banner_img: input.banner_img || "/fallbackbanner.png",
          ...(input.start_date && { start_date: new Date(input.start_date) }),
        };

        if (input.recurrence) {
          opportunityData.recurrence = {
            ...input.recurrence,
            date_range: {
              start_date: input.recurrence.date_range.start_date,
              end_date: input.recurrence.date_range.end_date,
            },
          };
        }

        const opportunity = await Opportunity.create(opportunityData);
        return opportunity;
      } catch (error) {
        console.error("Opportunity creation error:", error);
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
          .populate("organization_profile")
          .populate("created_by");

        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found",
          });
        }

        return opportunity;
      } catch (error) {
        console.error("Error fetching opportunity:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch opportunity",
          cause: error,
        });
      }
    }),

  getOrganizationOpportunities: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;
    if (!sessionUser || !sessionUser?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view opportunities",
      });
    }

    try {
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
          message: "Organization profile not found",
        });
      }

      const opportunities = await Opportunity.find({
        organization_profile: user.organization_profile,
      })
        .populate("organization_profile")
        .sort({ createdAt: -1 });

      // Get applicant and recruit counts for each opportunity
      const opportunitiesWithCounts = await Promise.all(
        opportunities.map(async (opportunity) => {
          const [applicantCount, recruitCount] = await Promise.all([
            VolunteerApplication.countDocuments({
              opportunity: opportunity._id,
            }),
            OrganisationRecruitment.countDocuments({
              application: {
                $in: await VolunteerApplication.find({
                  opportunity: opportunity._id,
                }).select("_id"),
              },
            }),
          ]);

          return {
            ...opportunity.toObject(),
            applicantCount,
            recruitCount,
          };
        })
      );

      return opportunitiesWithCounts;
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch opportunities",
        cause: error,
      });
    }
  }),

  getAllOpportunities: protectedProcedure
    .input(opportunityValidation.getAllOpportunitiesSchema)
    .query(async ({ input }) => {
      try {
        const { page, limit, search, categories, commitmentType, location, availability } = input;
        const skip = (page - 1) * limit;

        // Build base query
        const baseQuery: Record<string, unknown> = {
          // Only show non-archived opportunities
          is_archived: false
        };

        // Add search filter
        if (search) {
          const searchRegex = new RegExp(search, 'i');
          baseQuery.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex },
            { 'organization_profile.title': searchRegex },
          ];
        }

        // Add category filter
        if (categories && categories.length > 0) {
          baseQuery.category = { $in: categories };
        }

        // Add commitment type filter
        if (commitmentType !== "all") {
          baseQuery.commitment_type = commitmentType;
        }

        // Add location filter
        if (location) {
          const locationRegex = new RegExp(location, 'i');
          baseQuery.location = locationRegex;
        }

        // Add availability filter
        if (availability?.startDate && availability?.endDate) {
          // Filter opportunities that have dates within the specified range
          baseQuery.$or = [
            // For recurring opportunities with date range
            {
              'recurrence.date_range.start_date': { 
                $exists: true, 
                $ne: null,
                $lte: availability.endDate 
              },
              'recurrence.date_range.end_date': { 
                $exists: true, 
                $ne: null,
                $gte: availability.startDate 
              }
            },
            // For single date opportunities
            {
              start_date: { 
                $exists: true, 
                $ne: null,
                $gte: availability.startDate,
                $lte: availability.endDate
              }
            }
          ];
        }

        console.log("Opportunity Query:", JSON.stringify(baseQuery, null, 2));

        // Get total count for pagination
        const total = await Opportunity.countDocuments(baseQuery);
        const totalPages = Math.ceil(total / limit);

        console.log("Total opportunities found:", total);
        console.log("Total pages:", totalPages);
        console.log("Skip:", skip);
        console.log("Limit:", limit);

        // Execute query with pagination
        const opportunities = await Opportunity.find(baseQuery)
          .populate("organization_profile")
          .populate("created_by")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        console.log(`Found ${opportunities.length} opportunities out of ${total} total`);

        return {
          opportunities,
          total,
          totalPages,
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        };
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch opportunities",
          cause: error,
        });
      }
    }),

  archiveOpportunity: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: opportunityId }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to archive an opportunity",
        });
      }

      try {
        const opportunity = await Opportunity.findById(opportunityId).populate(
          "organization_profile"
        );

        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found",
          });
        }

        // Get the user to check their role
        const user = await User.findById(sessionUser.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if the user is either the creator or a mentor
        const isCreator = opportunity.created_by.toString() === sessionUser.id;
        const isAdmin = user.role === "admin";
        const isOrganization = user.role === "organization";
        const isMentor = user.role === "mentor";

        if (!isCreator && !isAdmin && !isOrganization && !isMentor) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to archive this opportunity",
          });
        }
        // Update the opportunity
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
          opportunityId,
          { is_archived: true },
          { new: true }
        );

        if (!updatedOpportunity) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update opportunity",
          });
        }

        return updatedOpportunity;
      } catch (error) {
        console.error("Error archiving opportunity:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to archive opportunity",
          cause: error,
        });
      }
    }),

  deleteOpportunity: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: opportunityId }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to delete an opportunity",
        });
      }

      try {
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found",
          });
        }

        // Get the user to check their role
        const user = await User.findById(sessionUser.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if the user is either the creator, admin, organization, or mentor
        const isCreator = opportunity.created_by.toString() === sessionUser.id;
        const isAdmin = user.role === "admin";
        const isOrganization = user.role === "organization";
        const isMentor = user.role === "mentor";

        if (!isCreator && !isAdmin && !isOrganization && !isMentor) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to delete this opportunity",
          });
        }

        // Check if opportunity is already deleted
        if (opportunity.deleted_at) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Opportunity is already deleted",
          });
        }

        // Soft delete by setting deleted_at timestamp
        const updateResult = await Opportunity.findByIdAndUpdate(
          opportunityId,
          { deleted_at: new Date() },
          { new: true, runValidators: false }
        );

        if (!updateResult) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete opportunity - update failed",
          });
        }

        return { success: true, message: "Opportunity deleted successfully" };
      } catch (error) {
        console.error("Error deleting opportunity:", error);
        
        // If it's already a TRPC error, re-throw it
        if (error instanceof TRPCError) {
          throw error;
        }
        
        // Handle mongoose validation errors
        if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Validation error while deleting opportunity",
            cause: error,
          });
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete opportunity",
          cause: error,
        });
      }
    }),
});
