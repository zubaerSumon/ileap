import { authValidation } from "@/server/modules/auth/auth.validation";
import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";

export type SignupForm = z.infer<typeof authValidation.signupSchema>;

export const VolunteerProfileFormSchema = userValidation.volunteerSchema;
export type VolunteerProfileForm = z.infer<typeof VolunteerProfileFormSchema>;
