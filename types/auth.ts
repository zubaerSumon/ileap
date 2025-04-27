import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";

export const signupBaseSchema = userValidation.userSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const profileBasicSchema = userValidation.volunteerSchema.pick({
  bio: true,
  interested_on: true,
  phone_number: true,
  state: true,
  area: true,
  postcode: true,
});

export const profileDetailSchema = userValidation.volunteerSchema.pick({
  student_type: true,
  home_country: true,
  course: true,
  major: true,
  referral_source: true,
  referral_source_other: true,
});

export const orgProfileSchema = userValidation.organizationSchema;
export const volunteerSignupSchema = z
  .object({
    ...signupBaseSchema.shape,
    ...profileBasicSchema.shape,
    ...profileDetailSchema.shape,
    confirm_password: z
      .string()
      .min(6, "")
      .nonempty("Please confirm your password"),
    media_consent: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm_password"],
      });
    }
    if (data.student_type === "yes" && !data.home_country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Home country is required for international students",
        path: ["home_country"],
      });
    }
    if (data.referral_source === "other" && !data.referral_source_other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify how you heard about us",
        path: ["referral_source_other"],
      });
    }
  });
export const orgSignupSchema = z.object({
  ...signupBaseSchema.shape,
  ...orgProfileSchema.shape,
  confirm_password: z
    .string()
    .min(6, "")
    .nonempty("Please confirm your password"),
});
export type VolunteerSignupForm = z.infer<typeof volunteerSignupSchema>;
export type OrgSignupForm = z.infer<typeof orgSignupSchema>;
export type SignupFormData = z.infer<typeof signupBaseSchema>;
