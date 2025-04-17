import { authValidation } from "@/server/modules/auth/auth.validation";
import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";

export const SignupFormSchema = authValidation.signupSchema;
export type SignupForm = z.infer<typeof SignupFormSchema>;

export const VolunteerProfileFormSchema = userValidation.volunteerSchema;
export type VolunteerProfileForm = z.infer<typeof VolunteerProfileFormSchema>;
