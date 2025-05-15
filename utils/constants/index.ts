import { authValidation } from "@/server/modules/auth/auth.validation";
import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";
import { volunteerValidation } from "@/server/modules/volunteer-profile/volunteer-profile.valdation";
export const SignupFormSchema = authValidation.signupSchema;
export type SignupForm = z.infer<typeof SignupFormSchema>;

export const VolunteerProfileFormSchema = userValidation.volunteerSchema;
export type VolunteerProfileForm = z.infer<typeof VolunteerProfileFormSchema>;

export const VolunteerProfileUpdateSchema =
  volunteerValidation.updateVolunteerProfileSchema;
export type VolunteerProfileUpdateData = z.infer<
  typeof VolunteerProfileUpdateSchema
>;

export const ResetPasswordSchema =  userValidation.resetPasswordSchema;
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;