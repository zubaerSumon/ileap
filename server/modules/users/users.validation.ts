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
  role: z.enum([UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.MENTOR, UserRole.ORGANIZATION]),
  reffered_by: z.string().optional(),
  is_verified: z.boolean(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  provider: z.enum([AuthProvider.CREDENTIALS, AuthProvider.GOOGLE]).optional(),
  role: z
    .enum([UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.MENTOR, UserRole.ORGANIZATION])
    .optional(),
  image: z.string().optional(),
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
  title: z.string().min(1, "Organization name is required"),
  contact_email: z.string().email("Invalid email address").min(1, "Contact email is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  bio: z.string().min(1, "Organization description is required"),
  type: z.string().min(1, "Organization type is required")
    .refine((val) => [
      "ngo", "nonprofit", "community_group", "social_enterprise", "charity",
      "educational_institution", "healthcare_provider", "religious_institution",
      "environmental_group", "youth_organization", "arts_culture_group",
      "disaster_relief_agency", "advocacy_group", "international_aid",
      "sports_club", "animal_shelter"
    ].includes(val), "Please select a valid organization type"),
  opportunity_types: z.array(z.string())
    .min(1, "Please select at least one opportunity type")
    .refine((arr) => arr.every(item => item.length > 0), "All opportunity types must be valid"),
  required_skills: z.array(z.string())
    .min(1, "Please select at least one required skill")
    .refine((arr) => arr.every(item => item.length > 0), "All required skills must be valid"),
  state: z.string().min(1, "State is required"),
  area: z.string().min(1, "Area/Suburb is required"),
  abn: z.string().min(1, "ABN is required"),
  website: z.string().optional().refine(
    (val) => !val || val === "" || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val),
    "Please enter a valid website URL or leave it empty"
  ),
  profile_img: z.string().optional(),
  cover_img: z.string().optional(),
  user: z.string().optional(),
});

const applyToEventSchema = z.object({
  eventId: z.string(),
});

const getAvailableUsersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(200).default(6),
  search: z.string().optional(),
  categories: z.array(z.string()).optional(),
  studentType: z.enum(["all", "yes", "no"]).default("all"),
  availability: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
});

export const userValidation = {
  userSchema,
  updateUserSchema,
  volunteerProfileSchema,
  organizationProfileSchema,
  resetPasswordSchema,
  applyToEventSchema,
  getAvailableUsersSchema,
};
