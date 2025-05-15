import { protectedProcedure } from "@/server/middlewares/with-auth";
import { router } from "@/server/trpc";
import OrganizationProfile from "@/server/db/models/organization-profile";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { JwtPayload } from "jsonwebtoken";
import User from "@/server/db/models/user";

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
});
