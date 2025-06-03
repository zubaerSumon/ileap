import { router } from "@/server/trpc";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import User from "@/server/db/models/user";
import OrganizationMentor from "@/server/db/models/organization-mentor";
import OrganizationProfile from "@/server/db/models/organization-profile";
import MentorInvitation from "@/server/db/models/mentor-invitation";
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

        // Check if inviter is an organization admin
        const inviter = await User.findOne({ email: sessionUser.email });
        if (!inviter || inviter.role !== UserRole.ORGANIZATION) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only organization admins can invite mentors.",
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

        // Create new user account first
        const user = await User.create({
          email: invitation.email,
          name: input.name,
          role: UserRole.MENTOR,
          is_verified: true,
          provider: AuthProvider.CREDENTIALS,
          password: hashedPassword,
          organization_profile: invitation.organization_profile // Link organization profile to user
        });

        // Now create the OrganizationMentor record
        await OrganizationMentor.create({
          organization_profile: invitation.organization_profile,
          mentor: user._id,
          invited_by: invitation.invited_by,
          status: "accepted",
          email: invitation.email,
          name: invitation.name,
          invitation_token: invitation.token,
          invitation_expires: invitation.expires
        });

        // Delete the invitation after successful acceptance
        await MentorInvitation.deleteOne({ _id: invitation._id });

        return { message: "Invitation accepted successfully" };
      } catch (error) {
        console.error("Error in acceptInvitation:", error);
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

        const mentors = await OrganizationMentor.find({
          organization_profile: input.organizationId,
          status: "accepted",
        })
          .populate({
            path: "mentor",
            select: "name email",
          })
          .populate({
            path: "invited_by",
            select: "name email",
          });

        return mentors;
      } catch (error) {
        console.error("Error in getMentors:", error);
        throw error;
      }
    }),
}); 