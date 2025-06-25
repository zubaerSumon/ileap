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
import { publicProcedure } from "@/server/trpc";
import mongoose from "mongoose";

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
        // Transform the form data to match the database model structure
        interface OpportunityData {
          title: string;
          description: string;
          category: string[];
          required_skills: string[];
          commitment_type: string;
          location: string;
          number_of_volunteers: number;
          email_contact: string;
          phone_contact?: string;
          internal_reference?: string;
          date: {
            start_date: Date;
            end_date?: Date;
          };
          time: {
            start_time: string;
            end_time?: string;
          };
          is_recurring: boolean;
          banner_img?: string;
          organization_profile: mongoose.Types.ObjectId;
          created_by: mongoose.Types.ObjectId;
          recurrence?: {
            type: string;
            days: string[];
            date_range: {
              start_date: Date;
              end_date?: Date;
            };
            time_range: {
              start_time: string;
              end_time: string;
            };
            occurrences?: number;
          };
        }

        const opportunityData: OpportunityData = {
          title: input.title,
          description: input.description,
          category: input.category,
          required_skills: input.required_skills,
          commitment_type: input.commitment_type,
          location: input.location,
          number_of_volunteers: input.number_of_volunteers,
          email_contact: input.email_contact,
          phone_contact: input.phone_contact || undefined,
          internal_reference: input.internal_reference || undefined,
          // Map date and time fields to the nested structure
          date: {
            start_date: input.start_date ? new Date(input.start_date) : new Date(),
            end_date: undefined, // Will be set if needed
          },
          time: {
            start_time: input.start_time || "09:00",
            end_time: undefined, // Will be set if needed
          },
          is_recurring: input.is_recurring || false,
          banner_img: input.banner_img && input.banner_img.trim() !== "" ? input.banner_img : "/fallbackbanner.png",
          organization_profile: user.organization_profile,
          created_by: sessionUser.id,
        };

        // Handle recurrence data if it exists
        if (input.is_recurring && input.recurrence) {
          opportunityData.recurrence = {
            type: input.recurrence.type,
            days: input.recurrence.days || [],
            date_range: {
              start_date: input.recurrence.date_range.start_date ? new Date(input.recurrence.date_range.start_date) : new Date(),
              end_date: input.recurrence.date_range.end_date ? new Date(input.recurrence.date_range.end_date) : undefined,
            },
            time_range: {
              start_time: input.recurrence.time_range.start_time,
              end_time: input.recurrence.time_range.end_time,
            },
            occurrences: input.recurrence.occurrences,
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

        // Simplified base query for debugging
        const baseQuery: Record<string, unknown> = {
          is_archived: { $ne: true }, // Exclude archived opportunities
          // Temporarily remove deleted_at filter to see if that's the issue
          // deleted_at: { $exists: false }, // Explicitly exclude deleted opportunities
        };

        // Temporarily disable complex filtering for debugging
        console.log("=== DEBUGGING OPPORTUNITIES ===");
        console.log("Input parameters:", { page, limit, search, categories, commitmentType, location, availability });
        
        // Only apply simple filters for now
        if (search) {
          const searchRegex = new RegExp(search, 'i');
          baseQuery.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex }
          ];
        }

        if (categories && categories.length > 0) {
          baseQuery.category = { $in: categories };
        }

        if (commitmentType !== "all") {
          if (commitmentType === "eventbased") {
            baseQuery.commitment_type = { $in: ["eventbased", "oneoff"] };
          } else if (commitmentType === "workbased") {
            baseQuery.commitment_type = { $in: ["workbased", "regular"] };
          } else {
            baseQuery.commitment_type = commitmentType;
          }
        }

        if (location) {
          const locationRegex = new RegExp(location, 'i');
          baseQuery.location = locationRegex;
        }

        console.log("Final base query:", JSON.stringify(baseQuery, null, 2));

        // Get total count for pagination
        const total = await Opportunity.countDocuments(baseQuery);
        const totalPages = Math.ceil(total / limit);

        console.log("Total opportunities found:", total);
        console.log("Total pages:", totalPages);
        console.log("Skip:", skip);
        console.log("Limit:", limit);

        // Debug: Check total opportunities in database
        const totalInDB = await Opportunity.countDocuments({});
        console.log("Total opportunities in database:", totalInDB);
        
        // Debug: Check archived opportunities
        const archivedCount = await Opportunity.countDocuments({ is_archived: true });
        console.log("Archived opportunities:", archivedCount);
        
        // Debug: Check non-archived opportunities
        const nonArchivedCount = await Opportunity.countDocuments({ is_archived: { $ne: true } });
        console.log("Non-archived opportunities:", nonArchivedCount);

        // Debug: Check deleted opportunities
        const deletedCount = await Opportunity.countDocuments({ deleted_at: { $ne: null } });
        console.log("Deleted opportunities:", deletedCount);

        // Execute query with pagination
        const opportunities = await Opportunity.find(baseQuery)
          .populate("organization_profile")
          .populate("created_by")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        console.log(`Found ${opportunities.length} opportunities out of ${total} total`);
        console.log("Opportunity IDs found:", opportunities.map(opp => opp._id));
        
        // Debug: Check if opportunities have organization_profile
        const opportunitiesWithOrg = opportunities.filter(opp => opp.organization_profile);
        console.log(`Opportunities with organization_profile: ${opportunitiesWithOrg.length}`);
        
        // Debug: Check opportunity details
        opportunities.forEach((opp, index) => {
          console.log(`Opportunity ${index + 1}:`, {
            id: opp._id,
            title: opp.title,
            hasOrgProfile: !!opp.organization_profile,
            orgProfileId: opp.organization_profile?._id,
            isArchived: opp.is_archived,
            deletedAt: opp.deleted_at
          });
        });
        
        // Debug: Check organization_profile references
        if (opportunities.length > 0) {
          console.log("Checking organization_profile references...");
          const orgProfileIds = opportunities.map(opp => opp.organization_profile?._id).filter(id => id);
          console.log("Organization profile IDs:", orgProfileIds);
          
          // Check if these organization profiles exist
          const OrganizationProfile = mongoose.model('organization_profile');
          const existingOrgs = await OrganizationProfile.find({ _id: { $in: orgProfileIds } }).lean();
          console.log(`Found ${existingOrgs.length} existing organization profiles out of ${orgProfileIds.length} references`);
        }
        
        console.log("=== END DEBUGGING ===");

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

  // Debug endpoint to check database without authentication
  debugOpportunities: publicProcedure.query(async () => {
    try {
      console.log("Debug endpoint called");
      
      // Use the native collection to bypass middleware
      const collection = Opportunity.collection;
      
      const totalInDB = await collection.countDocuments({});
      console.log("Total in DB (native):", totalInDB);
      
      const archivedCount = await collection.countDocuments({ is_archived: true });
      console.log("Archived count (native):", archivedCount);
      
      const nonArchivedCount = await collection.countDocuments({ is_archived: { $ne: true } });
      console.log("Non-archived count (native):", nonArchivedCount);
      
      const nonDeletedCount = await collection.countDocuments({ deleted_at: { $exists: false } });
      console.log("Non-deleted count (native):", nonDeletedCount);
      
      const deletedCount = await collection.countDocuments({ deleted_at: { $ne: null } });
      console.log("Deleted count (native):", deletedCount);
      
      // Get a sample opportunity using native collection
      const sampleOpportunity = await collection.findOne({ 
        is_archived: { $ne: true },
        deleted_at: { $exists: false }
      });
      
      console.log("Sample opportunity (native):", sampleOpportunity);
      
      // Get all opportunities without middleware
      const allOpportunities = await collection.find({}).toArray();
      console.log("All opportunities (native):", allOpportunities.length);
      
      return {
        totalInDB,
        archivedCount,
        nonArchivedCount,
        nonDeletedCount,
        deletedCount,
        sampleOpportunity,
        allOpportunitiesCount: allOpportunities.length
      };
    } catch (error) {
      console.error("Error in debug endpoint:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to debug opportunities",
        cause: error,
      });
    }
  }),

  // Simple test endpoint to get raw opportunities
  testOpportunities: publicProcedure.query(async () => {
    try {
      console.log("Test opportunities endpoint called");
      
      // Use the native collection to bypass middleware
      const collection = Opportunity.collection;
      
      // Get all opportunities without any filtering
      const allOpportunities = await collection.find({}).toArray();
      console.log("Raw opportunities found:", allOpportunities.length);
      
      // Get opportunities without middleware filtering
      const nonArchivedOpportunities = await collection.find({ 
        is_archived: { $ne: true } 
      }).toArray();
      console.log("Non-archived opportunities:", nonArchivedOpportunities.length);
      
      // Get opportunities with explicit deleted_at filter
      const activeOpportunities = await collection.find({ 
        is_archived: { $ne: true },
        deleted_at: { $exists: false }
      }).toArray();
      console.log("Active opportunities:", activeOpportunities.length);
      
      return {
        total: allOpportunities.length,
        nonArchived: nonArchivedOpportunities.length,
        active: activeOpportunities.length,
        opportunities: activeOpportunities.slice(0, 5) // Return first 5 for inspection
      };
    } catch (error) {
      console.error("Error in test endpoint:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to test opportunities",
        cause: error,
      });
    }
  }),
});
