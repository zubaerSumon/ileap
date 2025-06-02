import { router } from "@/server/trpc";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import User from "@/server/db/models/user";
import OrganizationMentor from "@/server/db/models/organization-mentor";
import OrganizationProfile from "@/server/db/models/organization-profile";
import { z } from "zod";
import { sendMentorInvitationMail } from "@/utils/helpers/sendMentorInvitationMail";
import crypto from "crypto";
import { UserRole, AuthProvider } from "@/server/db/interfaces/user";

const inviteMentorSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
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
        let mentor = await User.findOne({ email: input.email });
        if (!mentor) {
          // Create new user account for mentor with temporary password
          const tempPassword = crypto.randomBytes(16).toString("hex");
          mentor = await User.create({
            email: input.email,
            name: input.name,
            role: UserRole.MENTOR,
            is_verified: true,
            provider: AuthProvider.CREDENTIALS,
            password: tempPassword, // This will be changed when they accept the invitation
          });
        }

        // Generate invitation token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // 24 hours expiry

        // Create mentor invitation
        await OrganizationMentor.create({
          organization_profile: input.organizationId,
          mentor: mentor._id,
          invited_by: inviter._id,
          invitation_token: token,
          invitation_expires: expires,
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
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to accept the invitation.",
          });
        }

        // Find the invitation
        const invitation = await OrganizationMentor.findOne({
          invitation_token: input.token,
          status: "pending",
          invitation_expires: { $gt: new Date() },
        });

        if (!invitation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid or expired invitation token.",
          });
        }

        // Update invitation status
        invitation.status = "accepted";
        await invitation.save();

        // Update user's role and password
        const user = await User.findOne({ email: sessionUser.email });
        if (user) {
          user.role = UserRole.MENTOR;
          user.password = input.password; // The password will be hashed by the model's pre-save hook
          await user.save();
        }

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