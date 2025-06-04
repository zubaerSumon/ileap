import User from "@/server/db/models/user";
import OrganizationProfile from "@/server/db/models/organization-profile";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { userValidation } from "./users.validation";
import bcrypt from "bcryptjs";
import { publicProcedure, router } from "@/server/trpc";
import VolunteerProfile from "@/server/db/models/volunteer-profile";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = router({
  getAvailableUsers: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;
    if (!sessionUser || !sessionUser?.id) {
      throw new Error("You must be logged in to view available users.");
    }

    const currentUser = await User.findById(sessionUser.id);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // If user is a volunteer, show admins and mentors
    if (currentUser.role === "volunteer") {
      const query = {
        _id: { $ne: currentUser._id },
        role: { $in: ["admin", "mentor"] },
      };
      const users = await User.find(query)
        .select("name avatar role")
        .populate("organization_profile");
      return users;
    }

    // If user is an admin or mentor, show volunteers
    if (currentUser.role === "admin" || currentUser.role === "mentor") {
      const query = {
        _id: { $ne: currentUser._id },
        role: "volunteer",
      };

      const users = await User.find(query).select("name avatar role").populate({
        path: "volunteer_profile",
        select: "student_type course availability_date interested_on bio",
      });
      return users;
    }

    return [];
  }),
  updateUser: protectedProcedure
    .input(userValidation.updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error("You must be logged in to update this data.");
      }

      const user = await User.findOne({ email: sessionUser.email });

      if (!user) {
        throw new Error("User not found.");
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { ...input },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User update failed");
      }

      return updatedUser;
    }),

  profileCheckup: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;
    if (!sessionUser || !sessionUser?.id) {
      throw new Error("You must be logged in to check profile.");
    }
    console.log("sessionUser", sessionUser);

    const user = await User.findOne({ email: sessionUser.email })
      .populate("volunteer_profile")
      .populate("organization_profile");

    if (!user) {
      throw new Error("User not found.");
    }

    // Add detailed logging of the organization profile
    console.log("Organization Profile Details:", {
      exists: !!user.organization_profile,
      raw: user.organization_profile,
      type: user.organization_profile?.type,
      title: user.organization_profile?.title,
      email: user.organization_profile?.contact_email,
    });

    const response = {
      hasVolunteerProfile: !!user.volunteer_profile,
      hasOrganizationProfile: !!user.organization_profile,
      volunteerProfile: user.volunteer_profile,
      organizationProfile: user.organization_profile,
    };

    // Log the response being sent
    console.log("Profile Checkup Response:", {
      hasOrgProfile: response.hasOrganizationProfile,
      orgProfile: response.organizationProfile,
      orgProfileType: response.organizationProfile?.type,
    });

    return response;
  }),

  setupVolunteerProfile: protectedProcedure
    .input(userValidation.volunteerProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.id) {
        throw new Error("You must be logged in to setup your profile.");
      }

      const volunteerProfile = await VolunteerProfile.create({
        ...input,
      });

      if (!volunteerProfile) {
        throw new Error("Failed to create volunteer profile");
      }

      return volunteerProfile;
    }),

  setupOrgProfile: protectedProcedure
    .input(userValidation.organizationProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser || !sessionUser?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to setup your profile.",
          });
        }

        console.log("Processing update for user:", sessionUser.email);
        console.log("Input data:", input);

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }

        // If user already has an organization profile, update it
        if (user.organization_profile) {
          console.log("Updating existing profile:", user.organization_profile);

          // Validate arrays before update
          if (!input.opportunity_types?.length) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "At least one opportunity type is required",
            });
          }
          if (!input.required_skills?.length) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "At least one required skill is required",
            });
          }

          const updateData = {
            ...input,
            updatedAt: new Date(),
          };

          console.log("Update data:", updateData);

          try {
            const updatedProfile = await OrganizationProfile.findByIdAndUpdate(
              user.organization_profile,
              updateData,
              {
                new: true,
                runValidators: true,
                context: "query",
              }
            );

            if (!updatedProfile) {
              console.error(
                "Failed to update profile for user:",
                sessionUser.email
              );
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update organization profile",
              });
            }

            console.log("Profile updated successfully:", updatedProfile);
            return updatedProfile;
          } catch (error) {
            console.error("Mongoose validation error:", error);
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                error instanceof Error ? error.message : "Validation failed",
            });
          }
        }

        // If user doesn't have an organization profile, create a new one
        console.log("Creating new profile for user:", sessionUser.email);

        try {
          const organizationProfile = await OrganizationProfile.create({
            ...input,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          if (!organizationProfile) {
            console.error(
              "Failed to create profile for user:",
              sessionUser.email
            );
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create organization profile",
            });
          }

          // Update user with the new organization profile reference
          await User.findByIdAndUpdate(
            user._id,
            {
              organization_profile: organizationProfile._id,
            },
            { new: true }
          );

          console.log("New profile created successfully:", organizationProfile);
          return organizationProfile;
        } catch (error) {
          console.error("Mongoose creation error:", error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              error instanceof Error
                ? error.message
                : "Failed to create profile",
          });
        }
      } catch (error) {
        console.error("Error in setupOrgProfile:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to process organization profile",
          cause: error,
        });
      }
    }),

  resetPassword: publicProcedure
    .input(userValidation.resetPasswordSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new Error(
          "No account found with this email address. Please check and try again."
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Password reset failed. Please try again.");
      }

      return {
        success: true,
        message: "Password has been successfully reset",
      };
    }),

  getOrganizationUsers: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view users.",
        });
      }

      const currentUser = await User.findOne({ email: sessionUser.email });
      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Current user not found.",
        });
      }

      // Only admins can view organization users
      if (currentUser.role !== "admin" && currentUser.role !== "mentor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view organization users.",
        });
      }

      const users = await User.find({
        organization_profile: input.organizationId,
      }).select("name email role avatar");

      return users;
    }),

  updateUserRole: protectedProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(["admin", "mentor"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to update user roles.",
        });
      }

      const currentUser = await User.findOne({ email: sessionUser.email });
      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Current user not found.",
        });
      }

      // Only admins can update user roles
      if (currentUser.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update user roles.",
        });
      }

      const userToUpdate = await User.findById(input.userId);
      if (!userToUpdate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User to update not found.",
        });
      }

      // Ensure user belongs to the same organization
      if (userToUpdate.organization_profile?.toString() !== currentUser.organization_profile?.toString()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot update user from a different organization.",
        });
      }

      userToUpdate.role = input.role;
      await userToUpdate.save();

      return userToUpdate;
    }),

  deleteUser: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to delete users.",
        });
      }

      const currentUser = await User.findOne({ email: sessionUser.email });
      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Current user not found.",
        });
      }

      // Only admins can delete users
      if (currentUser.role !== "admin" && currentUser.role !== "mentor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete users.",
        });
      }

      const userToDelete = await User.findById(input.userId);
      if (!userToDelete) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User to delete not found.",
        });
      }

      // Ensure user belongs to the same organization
      if (userToDelete.organization_profile?.toString() !== currentUser.organization_profile?.toString()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete user from a different organization.",
        });
      }

      // Prevent deleting the last admin
      if (userToDelete.role === "admin") {
        const adminCount = await User.countDocuments({
          organization_profile: currentUser.organization_profile,
          role: "admin",
        });

        if (adminCount <= 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot delete the last admin of the organization.",
          });
        }
      }

      await User.findByIdAndDelete(input.userId);

      return { success: true };
    }),
});
