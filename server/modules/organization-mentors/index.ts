import { router } from "@/server/trpc";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import User from "@/server/db/models/user";
import OrganizationProfile from "@/server/db/models/organization-profile";
import MentorInvitation from "@/server/db/models/mentor-invitation";
import OpportunityMentor from "@/server/db/models/opportunity-mentor";
import Opportunity from "@/server/db/models/opportunity";
import { z } from "zod";
import { sendMentorInvitationMail } from "@/utils/helpers/sendMentorInvitationMail";
import crypto from "crypto";
import { UserRole, AuthProvider } from "@/server/db/interfaces/user";
import bcrypt from "bcryptjs";

const inviteMentorSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const markAsMentorSchema = z.object({
  volunteerId: z.string().min(1, "Volunteer ID is required"),
  opportunityId: z.string().min(1, "Opportunity ID is required"),
});

export const organizationMentorRouter = router({
  inviteMentor: protectedProcedure
    .input(inviteMentorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to invite mentors.",
          });
        }

        // Check if inviter is an admin or mentor
        const inviter = await User.findOne({ email: sessionUser.email });
        if (!inviter || (inviter.role !== UserRole.ADMIN && inviter.role !== UserRole.MENTOR)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins and mentors can invite mentors.",
          });
        }

        // Check if organization exists
        const organization = await OrganizationProfile.findById(input.organizationId);
        if (!organization) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organization not found.",
          });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A user with this email already exists.",
          });
        }

        // Generate invitation token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date();
        expires.setHours(expires.getHours() + 24);

        // Store invitation details
        await MentorInvitation.create({
          organization_profile: input.organizationId,
          invited_by: inviter._id,
          email: input.email,
          name: input.name,
          token,
          expires
        });

        // Send invitation email
        await sendMentorInvitationMail(
          input.email,
          input.name,
          input.organizationId,
          token
        );

        return { message: "Mentor invitation sent successfully" };
      } catch (error) {
        console.error("Error in inviteMentor:", error);
        throw error;
      }
    }),

  acceptInvitation: protectedProcedure
    .input(acceptInvitationSchema)
    .mutation(async ({ input }) => {
      try {
        // Find the invitation
        const invitation = await MentorInvitation.findOne({
          token: input.token,
          expires: { $gt: new Date() }
        });

        if (!invitation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid or expired invitation token.",
          });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(input.password, salt);

        // Create new user account
        await User.create({
          email: invitation.email,
          name: input.name,
          role: UserRole.MENTOR,
          is_verified: true,
          provider: AuthProvider.CREDENTIALS,
          password: hashedPassword,
          organization_profile: invitation.organization_profile
        });

        // Delete the invitation after successful acceptance
        await MentorInvitation.deleteOne({ _id: invitation._id });

        return { message: "Invitation accepted successfully" };
      } catch (error) {
        console.error("Error in acceptInvitation:", error);
        throw error;
      }
    }),

  markAsMentor: protectedProcedure
    .input(markAsMentorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to mark volunteers as mentors.",
          });
        }

        // Check if current user is an admin or mentor
        const currentUser = await User.findOne({ email: sessionUser.email });
        if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.MENTOR)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins and mentors can mark volunteers as mentors.",
          });
        }

        // Check if opportunity exists and get its organization
        const opportunity = await Opportunity.findById(input.opportunityId);
        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found.",
          });
        }

        // Check if current user belongs to the same organization as the opportunity
        if (currentUser.organization_profile?.toString() !== opportunity.organization_profile.toString()) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only mark volunteers as mentors for opportunities within your organization.",
          });
        }

        // Find the volunteer to mark as mentor
        const volunteer = await User.findById(input.volunteerId);
        if (!volunteer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Volunteer not found.",
          });
        }

        // Check if volunteer is already a mentor for this opportunity
        const existingMentorAssignment = await OpportunityMentor.findOne({
          opportunity: input.opportunityId,
          volunteer: input.volunteerId,
        });

        if (existingMentorAssignment) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This volunteer is already a mentor for this opportunity.",
          });
        }

        // Create opportunity-specific mentor assignment
        const mentorAssignment = await OpportunityMentor.create({
          opportunity: input.opportunityId,
          volunteer: input.volunteerId,
          organization_profile: opportunity.organization_profile,
          assigned_by: currentUser._id,
          assigned_at: new Date(),
        });

        return { 
          message: "Volunteer has been successfully marked as mentor for this opportunity",
          mentorAssignment: {
            id: mentorAssignment._id,
            opportunityId: mentorAssignment.opportunity,
            volunteerId: mentorAssignment.volunteer,
            assignedAt: mentorAssignment.assigned_at
          }
        };
      } catch (error) {
        console.error("Error in markAsMentor:", error);
        throw error;
      }
    }),

  getOpportunityMentors: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view opportunity mentors.",
          });
        }

        const mentors = await OpportunityMentor.find({
          opportunity: input.opportunityId,
        })
        .populate('volunteer', 'name email')
        .populate('assigned_by', 'name email')
        .sort({ assigned_at: -1 });

        return mentors;
      } catch (error) {
        console.error("Error in getOpportunityMentors:", error);
        throw error;
      }
    }),

  getMentors: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view mentors.",
          });
        }

        const mentors = await User.find({
          organization_profile: input.organizationId,
          role: UserRole.MENTOR
        }).select('name email');

        return mentors;
      } catch (error) {
        console.error("Error in getMentors:", error);
        throw error;
      }
    }),
}); 