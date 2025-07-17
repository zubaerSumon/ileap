import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";

export const signupBaseSchema = userValidation.userSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const profileBasicSchema = userValidation.volunteerProfileSchema.pick({
  bio: true,
  interested_on: true,
  interested_categories: true,
  phone_number: true,
  state: true,
  area: true,
  postcode: true,
});

export const profileDetailSchema = userValidation.volunteerProfileSchema.pick({
  student_type: true,
  home_country: true,
  course: true,
  major: true,
  major_other: true,
  referral_source: true,
  referral_source_other: true,
  is_currently_studying: true,
  non_student_type: true,
  university: true,
  graduation_year: true,
  study_area: true,
});

export const orgProfileSchema = userValidation.organizationProfileSchema;
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
    
    // Validation for currently studying users
    if (data.is_currently_studying === "yes") {
      if (!data.student_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify if you are a student",
          path: ["student_type"],
        });
      }
      if (!data.course) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Course is required",
          path: ["course"],
        });
      }
      if (data.student_type === "yes" && !data.home_country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Home country is required for international students",
          path: ["home_country"],
        });
      }
      if (data.major === "other" && !data.major_other) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify your major",
          path: ["major_other"],
        });
      }
    } else if (data.is_currently_studying === "no") {
      // Clear student-related fields for non-students
      data.student_type = undefined;
      data.course = undefined;
      data.major = undefined;
      data.major_other = undefined;
      data.home_country = undefined;
    }
    
    // Validation for non-students
    if (data.is_currently_studying === "no") {
      if (!data.non_student_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify your type",
          path: ["non_student_type"],
        });
      }
      if (data.non_student_type === "alumni" && !data.university) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "University is required for alumni",
          path: ["university"],
        });
      }
      if (data.non_student_type === "alumni" && !data.graduation_year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Graduation year is required for alumni",
          path: ["graduation_year"],
        });
      }
      if (data.non_student_type === "alumni" && !data.study_area) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Study area is required for alumni",
          path: ["study_area"],
        });
      }
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
export type OrgSignupFormData = z.infer<typeof orgSignupSchema>;
export type SignupFormData = z.infer<typeof signupBaseSchema>;
