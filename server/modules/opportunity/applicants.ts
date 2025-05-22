import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const applicantsRouter = createTRPCRouter({
  getApplicants: protectedProcedure
    .input(
      z.object({
        opportunityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { opportunityId } = input;

      const applicants = await ctx.db.volunteerApplication.findMany({
        where: {
          opportunity_id: opportunityId,
          status: "ACCEPTED", // Only get accepted applications
        },
        include: {
          volunteer: {
            select: {
              id: true,
              name: true,
              profile_img: true,
              location: true,
              bio: true,
              skills: true,
              completed_projects: true,
              availability: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      if (!applicants) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No applicants found for this opportunity",
        });
      }

      return applicants.map((applicant) => ({
        id: applicant.volunteer.id,
        name: applicant.volunteer.name,
        profileImg: applicant.volunteer.profile_img || "/avatar.svg",
        location: applicant.volunteer.location,
        bio: applicant.volunteer.bio,
        skills: applicant.volunteer.skills,
        completedProjects: applicant.volunteer.completed_projects,
        availability: applicant.volunteer.availability,
        applicationId: applicant.id,
      }));
    }),
}); 