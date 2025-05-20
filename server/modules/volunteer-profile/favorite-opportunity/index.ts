import { router } from "@/server/trpc";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { favoriteOpportunityValidation } from "./favorite-opportunity.validation";
import User from "@/server/db/models/user";
import FavoriteOpportunity from "@/server/db/models/favorite-opportunity";
import { JwtPayload } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
 

export const favoriteOpportunityRouter = router({
  getFavoriteStatus: protectedProcedure
    .input(favoriteOpportunityValidation.getFavoriteStatusSchema)
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
    .input(favoriteOpportunityValidation.toggleFavoriteSchema)
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

  getFavoriteOpportunities: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view favorites.",
        });
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      const favorites = await FavoriteOpportunity.find({ user: user._id })
        .select("opportunity")
        .lean()
        .exec();

      return favorites.map(fav => ({
        _id: fav._id,
        opportunity: fav.opportunity
      }));
    } catch (error) {
      console.error("Error fetching favorite opportunities:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch favorite opportunities",
        cause: error,
      });
    }
  }),
}); 