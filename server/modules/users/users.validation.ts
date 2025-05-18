import { AuthProvider, UserRole } from "@/server/db/interfaces/user";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),
  provider: z.enum([AuthProvider.CREDENTIALS, AuthProvider.GOOGLE]),
  role: z.enum([UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.ORGANIZATION]),
  reffered_by: z.string().optional(),
  is_verified: z.boolean(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  provider: z.enum([AuthProvider.CREDENTIALS, AuthProvider.GOOGLE]).optional(),
  role: z
    .enum([UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.ORGANIZATION])
    .optional(),
  reffered_by: z.string().optional(),
  is_verified: z.boolean().optional(),
  volunteer_profile: z.string().optional(),
  organization_profile: z.string().optional(),
});

const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const volunteerProfileSchema = z.object({
  bio: z.string().nonempty("Your motivation is required"),
  interested_on: z
    .array(z.string())
    .nonempty("Please select at least one interest"),
  phone_number: z.string().nonempty("Phone number is required"),
  country: z.string().optional(),
  state: z.string().nonempty("State is required"),
  area: z.string().nonempty("Area/Suburb is required"),
  postcode: z.string().nonempty("Postcode is required"),
  student_type: z.string().nonempty("Please specify if you are a student"),
  course: z.string().nonempty("Course is required"),
  major: z.string().optional(),
  major_other: z.string().optional(),
  referral_source: z.string().nonempty("Please select a referral source"),
  home_country: z.string().optional(),
  referral_source_other: z.string().optional(),
  user: z.string().optional(),
});

const organizationProfileSchema = z.object({
  title: z.string().nonempty("Title is required"),
  contact_email: z.string().email("Invalid email address"),
  phone_number: z.string().nonempty("Phone number is required"),
  bio: z.string().nonempty("Motivation is required"),
  type: z.string().nonempty("Type is required"),
  opportunity_types: z
    .array(z.string())
    .nonempty("Please select at least one volunteer work"),
  required_skills: z.array(z.string()).nonempty("Skills is required"),
  state: z.string().nonempty("State is required"),
  area: z.string().nonempty("Area/Suburb is required"),
  abn: z.string().nonempty("ABN is required"),
  website: z.string().optional(),
  profile_img: z.string().optional(),
  cover_img: z.string().optional(),
  user: z.string().optional(),
});

const applyToEventSchema = z.object({
  eventId: z.string(),
});

export const userValidation = {
  userSchema,
  updateUserSchema,
  volunteerProfileSchema,
  organizationProfileSchema,
  resetPasswordSchema,
  applyToEventSchema,
};
