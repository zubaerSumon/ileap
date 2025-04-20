import { authValidation } from "@/server/modules/auth/auth.validation";
import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";
import { volunteerValidation } from "@/server/modules/volunteers/volunteers.valdation";
export const SignupFormSchema = authValidation.signupSchema;
export type SignupForm = z.infer<typeof SignupFormSchema>;

export const VolunteerProfileFormSchema = userValidation.volunteerSchema;
export type VolunteerProfileForm = z.infer<typeof VolunteerProfileFormSchema>;

export const VolunteerProfileUpdateSchema =
  volunteerValidation.updateVolunteerProfileSchema;
export type VolunteerProfileUpdateData = z.infer<
  typeof VolunteerProfileUpdateSchema
>;