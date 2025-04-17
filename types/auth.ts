import { z } from "zod";

export const signupBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters"),
  confirm_password: z.string().min(6, "Please confirm your password"),
});

export const profileBasicSchema = z.object({
  bio: z.string().min(1, "About you is required"),
  volunteer_type: z.array(z.string()).min(1, "Please select at least one volunteer type"),
  phone_number: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country/State is required"),
  street_address: z.string().min(1, "Area is required"),
  postcode: z.string().min(1, "Postcode is required"),
});

export const profileDetailSchema = z.object({
  student_type: z.string().optional(),
  home_country: z.string().optional(),
  course: z.string().optional(),
  major: z.string().optional(),
  referral_source: z.string().optional(),
  referral_source_other: z.string().optional(),
  media_consent: z.boolean().default(false),
});

export const volunteerSignupSchema = z.object({
  ...signupBaseSchema.shape,
  ...profileBasicSchema.shape,
  ...profileDetailSchema.shape,
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
  }
  if (data.student_type === 'international' && !data.home_country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Home country is required for international students",
      path: ["home_country"],
    });
  }
  if (data.referral_source === 'other' && !data.referral_source_other) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify how you heard about us",
      path: ["referral_source_other"],
    });
  }
});

export type VolunteerSignupForm = z.infer<typeof volunteerSignupSchema>;
export type SignupFormData = z.infer<typeof signupBaseSchema>; 