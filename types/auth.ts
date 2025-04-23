import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";

// Re-export the base schemas from server and add frontend validation messages
export const signupBaseSchema = userValidation.userSchema.pick({
  name: true,
  email: true,
  password: true,
}).extend({
  // Add explicit non-empty checks for frontend validation
  name: z.string().nonempty("Volunteer Name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string()
             .min(6, "Password must be at least 6 characters long")
             .nonempty("Password is required"), // Added non-empty check
});

// Add explicit non-empty checks for frontend validation
export const profileBasicSchema = userValidation.volunteerSchema.pick({
  bio: true,
  interested_on: true,
  phone_number: true,
  country: true,
  area: true,
  postcode: true,
}).extend({
  bio: z.string().nonempty("Bio is required"),
  interested_on: z.array(z.string()).nonempty("Please select at least one interest"), // Assuming interested_on is an array of strings
  phone_number: z.string().nonempty("Phone number is required"),
  country: z.string().nonempty("Country is required"),
  area: z.string().nonempty("Area/Suburb is required"),
  postcode: z.string().nonempty("Postcode is required"),
});

// Add explicit non-empty checks for frontend validation (excluding conditional fields)
export const profileDetailSchema = userValidation.volunteerSchema.pick({
  student_type: true,
  home_country: true, // Keep optional here, handled by superRefine
  course: true,
  major: true,
  referral_source: true,
  referral_source_other: true, // Keep optional here, handled by superRefine
}).extend({
  student_type: z.string().nonempty("Please specify if you are a student"),
  course: z.string().nonempty("Course is required"),
  major: z.string().nonempty("Major is required"),
  referral_source: z.string().nonempty("Please select a referral source"),
});

// Create the combined schema
export const volunteerSignupSchema = z.object({
  ...signupBaseSchema.shape,
  ...profileBasicSchema.shape,
  ...profileDetailSchema.shape,
  // Add non-empty check and message for confirm_password
  confirm_password: z.string()
                      .min(6, "")
                      .nonempty("Please confirm your password"),
  media_consent: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
  }
  // Conditional validation remains appropriate here
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