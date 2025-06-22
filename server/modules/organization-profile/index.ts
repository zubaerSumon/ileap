import { protectedProcedure } from "@/server/middlewares/with-auth";
import { router, publicProcedure } from "@/server/trpc";
import OrganizationProfile from "@/server/db/models/organization-profile";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { JwtPayload } from "jsonwebtoken";
import User from "@/server/db/models/user";
import Opportunity from "@/server/db/models/opportunity";

export const organizationProfileRouter = router({
  getOrganizationProfile: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: organizationId }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser || !sessionUser?.email) {
          throw new Error("You must be logged in to access this data.");
        }

        const user = await User.findOne({ email: sessionUser.email });

        if (!user) {
          throw new Error("User not found.");
        }
        const organizationProfile = await OrganizationProfile.findById(
          organizationId
        );

        if (!organizationProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organization profile not found",
          });
        }

        return {
          organizationProfile,
          user: {
            name: user.name,
            email: user.email
          }
        };
      } catch (error) {
        console.error("Error fetching organization profile:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch organization profile",
          cause: error,
        });
      }
    }),

  getAllOrganizations: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(10),
      sortBy: z.enum(["name", "updated"]).default("updated"),
    }))
    .query(async ({ input }) => {
      try {
        const { search, category, page, limit, sortBy } = input;
        const skip = (page - 1) * limit;

        // Build query
        const query: Record<string, unknown> = {};
        
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { bio: { $regex: search, $options: 'i' } },
            { area: { $regex: search, $options: 'i' } },
            { state: { $regex: search, $options: 'i' } },
          ];
        }

        if (category) {
          query.opportunity_types = { $in: [category] };
        }

        // Build sort object
        let sortObject: Record<string, 1 | -1> = {};
        switch (sortBy) {
          case "name":
            sortObject = { title: 1 };
            break;
          case "updated":
          default:
            sortObject = { updatedAt: -1 };
            break;
        }

        // Get organizations with pagination and sorting
        const organizations = await OrganizationProfile.find(query)
          .sort(sortObject)
          .skip(skip)
          .limit(limit);

        // Get total count for pagination
        const total = await OrganizationProfile.countDocuments(query);

        // Get opportunity counts for each organization
        const organizationsWithCounts = await Promise.all(
          organizations.map(async (org) => {
            const opportunityCount = await Opportunity.countDocuments({
              organization_profile: org._id,
              is_archived: false,
            });

            return {
              ...org.toObject(),
              opportunityCount,
            };
          })
        );

        return {
          organizations: organizationsWithCounts,
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        };
      } catch (error) {
        console.error("Error fetching organizations:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch organizations",
          cause: error,
        });
      }
    }),
});
