import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";
 
// Re-export the base schemas from server
export const signupBaseSchema = userValidation.userSchema.pick({
  name: true,
  email: true,
  password: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const profileBasicSchema = userValidation.volunteerSchema.pick({
  bio: true,
  interested_on: true,
  phone_number: true,
  country: true,
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

// Create the combined schema
export const volunteerSignupSchema = z.object({
  ...signupBaseSchema.shape,
  ...profileBasicSchema.shape,
  ...profileDetailSchema.shape,
  confirm_password: z.string().min(6, ""),
  media_consent: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
  }
  if (data.student_type === 'yes' && !data.home_country) {
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

// Create types from the schemas
export type VolunteerSignupForm = z.infer<typeof volunteerSignupSchema>;
export type SignupFormData = z.infer<typeof signupBaseSchema>;
 
// Organization signup schema
export const organizationSignupSchema = z.object({
  // Step 1: Account Creation
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string().min(8, "Please confirm your password"),
  
  // Step 2: Basic Organization Profile
  organization_name: z.string().min(1, "Organization name is required"),
  organization_website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  organization_type: z.enum(["nonprofit", "educational", "government", "community", "other"]),
  phone_number: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  area: z.string().min(1, "Area is required"),
  postcode: z.string().min(1, "Postcode is required"),
  
  // Step 3: Detailed Organization Profile
  mission_statement: z.string().min(1, "Mission statement is required"),
  services_provided: z.string().min(1, "Services provided is required"),
  target_audience: z.string().min(1, "Target audience is required"),
  referral_source: z.enum(["social_media", "search_engine", "word_of_mouth", "event", "other"]),
  referral_source_other: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
}).refine(
  (data) => {
    if (data.referral_source === "other") {
      return !!data.referral_source_other;
    }
    return true;
  },
  {
    message: "Please specify how you heard about us",
    path: ["referral_source_other"],
  }
);

export type OrganizationSignupForm = z.infer<typeof organizationSignupSchema>;