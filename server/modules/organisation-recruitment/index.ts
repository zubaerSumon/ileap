import { router } from "@/server/trpc";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import User from "@/server/db/models/user";
import OrganisationRecruitment from "@/server/db/models/organisation-recruitment";
import VolunteerApplication from "@/server/db/models/volunteer-application";
import connectDB from "@/server/config/mongoose";
import { organisationRecruitmentValidation } from "./organisation-recruitment.validation";
import { z } from "zod";

export const organisationRecruitmentRouter = router({
  getRecruitmentStatus: protectedProcedure
    .input(organisationRecruitmentValidation.recruitApplicantSchema)
    .query(async ({   input }) => {
      try {
        await connectDB();
       
        const recruitment = await OrganisationRecruitment.findOne({
          application: input.applicationId,
        });

        return { isRecruited: !!recruitment };
      } catch (error) {
        console.error("Error checking recruitment status:", error);
        return { isRecruited: false };
      }
    }),

  recruitApplicant: protectedProcedure
    .input(organisationRecruitmentValidation.recruitApplicantSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await connectDB();

        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to recruit applicants.",
          });
        }

        const recruiter = await User.findOne({ email: sessionUser.email });
        if (!recruiter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Recruiter not found.",
          });
        }

        const application = await VolunteerApplication.findById(
          input.applicationId
        );
        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found.",
          });
        }

        // Check if already recruited
        const existingRecruitment = await OrganisationRecruitment.findOne({
          application: input.applicationId,
        });

        if (existingRecruitment) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Applicant has already been recruited for this opportunity.",
          });
        }

        const organisationRecruitment = await OrganisationRecruitment.create({
          application: input.applicationId,
          recruited_by: recruiter._id,
        });

        return organisationRecruitment;
      } catch (error) {
        console.error("Error in recruitApplicant:", error);
        throw error;
      }
    }),

  getRecruitedApplicants: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        await connectDB();

        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view recruited applicants.",
          });
        }

        // Find all recruited applications for this opportunity
        const recruitedApplications = await OrganisationRecruitment.find()
          .populate({
            path: "application",
            match: { opportunity: input.opportunityId },
            populate: {
              path: "volunteer",
              select: "name email",
              populate: {
                path: "volunteer_profile",
                select:
                  "profile_img location bio skills completed_projects availability",
              },
            },
          })
          .lean();

        // Filter out null applications (where opportunity didn't match)
        const validRecruitedApplications = recruitedApplications.filter(
          (recruitment) => recruitment.application
        );

        // Transform the data to match the expected format
        return validRecruitedApplications.map((recruitment) => {
          const app = recruitment as unknown as {
            application: {
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
          };

          return {
            id: app.application.volunteer._id.toString(),
            name: app.application.volunteer.name || "",
            email: app.application.volunteer.email || "",
            profileImg:
              app.application.volunteer.volunteer_profile?.profile_img ||
              "/avatar.svg",
            location:
              app.application.volunteer.volunteer_profile?.location || "",
            bio: app.application.volunteer.volunteer_profile?.bio || "",
            skills: app.application.volunteer.volunteer_profile?.skills || [],
            completedProjects:
              app.application.volunteer.volunteer_profile?.completed_projects ||
              0,
            availability:
              app.application.volunteer.volunteer_profile?.availability || "",
            applicationId: app.application._id.toString(),
          } as const;
        });
      } catch (error) {
        console.error("Error in getRecruitedApplicants:", error);
        throw error;
      }
    }),
});
