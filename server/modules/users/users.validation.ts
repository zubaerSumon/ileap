import { AuthProvider, UserRole } from "@/server/db/interfaces/user";
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
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
  role: z.enum([UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.ORGANIZATION]).optional(),
  reffered_by: z.string().optional(),
  is_verified: z.boolean().optional(),
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


const volunteerSchema = z.object({
  phone_number: z.string(),
  bio: z.string(),
  interested_on: z.array(z.string()),
  country: z.string(),
  area: z.string(),
  postcode: z.string(),
  student_type: z.string().optional(),
  home_country: z.string().optional(),
  course: z.string().optional(),
  major: z.string().optional(),
  referral_source: z.string().optional(),
  referral_source_other: z.string().optional(),
  user: z.string().optional(),
});

const organizationSchema = z.object({
  phone: z.string(),
  bio: z.string(),
  type: z.string(),
  categories: z.array(z.string()),
  skills_required: z.array(z.string()),
  country: z.string(),
  street_address: z.string(),
  abn: z.string(),
  website: z.string(),
  profile_img: z.string().optional(),
  user: z.string().optional(), 
});

export const userValidation = {
  userSchema,
  updateUserSchema,
  volunteerSchema,
  organizationSchema,
  resetPasswordSchema
};
