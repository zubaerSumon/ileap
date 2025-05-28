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
          volunteer: user._id,
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
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
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
          volunteer: user._id,
        });

        if (existingApplication) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have already applied for this opportunity.",
          });
        }

        const application = await VolunteerApplication.create({
          opportunity: input.opportunityId,
          volunteer: user._id,
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
  getVolunteersByOpportunity: protectedProcedure
    .input(volunteerApplicationValidation.getApplicationStatusSchema)
    .query(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view volunteers",
          });
        }

        // Get all applications for this opportunity
        const applications = await VolunteerApplication.find({
          opportunity: input.opportunityId,
        })
          .populate({
            path: "volunteer",
            populate: {
              path: "user",
              select: "name email avatar",
            },
          })
          .lean();

        // Transform the data to include volunteer details
        const volunteers = applications.map((app) => ({
          _id: app.volunteer._id,
          name: app.volunteer.user.name,
          email: app.volunteer.user.email,
          avatar: app.volunteer.user.avatar,
          status: app.status,
          appliedAt: app.createdAt,
        }));

        return volunteers;
      } catch (error) {
        console.error("Error fetching volunteers by opportunity:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch volunteers",
          cause: error,
        });
      }
    }),
  getOpportunityApplicants: protectedProcedure
    .input(volunteerApplicationValidation.getOpportunityApplicantsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view applicants.",
          });
        }

        const applications = await VolunteerApplication.find({
          opportunity: input.opportunityId,
        })
          .populate({
            path: "volunteer",
            select: "name email",
            populate: {
              path: "volunteer_profile",
              select:
                "profile_img location bio skills completed_projects availability",
            },
          })
          .lean();

        if (!applications) {
          return [];
        }

        // Filter out applications with missing volunteer data
        const validApplications = applications.filter(app => app.volunteer);

        return validApplications.map((application) => {
          const app = application as unknown as {
            _id: { toString(): string };
            volunteer: {
              _id: { toString(): string };
              name?: string;
              email?: string;
              volunteer_profile?: {
                profile_img?: string;
                location?: string;
                bio?: string;
                skills?: string[];
                completed_projects?: number;
                availability?: string;
              };
            };
          };

          return {
            id: app.volunteer._id.toString(),
            name: app.volunteer.name || "",
            email: app.volunteer.email || "",
            profileImg:
              app.volunteer.volunteer_profile?.profile_img || "/avatar.svg",
            location: app.volunteer.volunteer_profile?.location || "",
            bio: app.volunteer.volunteer_profile?.bio || "",
            skills: app.volunteer.volunteer_profile?.skills || [],
            completedProjects:
              app.volunteer.volunteer_profile?.completed_projects || 0,
            availability: app.volunteer.volunteer_profile?.availability || "",
            applicationId: app._id.toString(),
          } as const;
        });
      } catch (error) {
        console.error("Error getting opportunity applicants:", error);
        throw error;
      }
    }),
});
