import { AuthProvider, UserRole } from "@/server/db/interfaces/user";
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  provider: z.enum([AuthProvider.CREDENTIALS, AuthProvider.GOOGLE]),
  role: z.enum([UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.ORGANIZATION]),
  reffered_by: z.string().optional(),
  isVerified: z.boolean(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  provider: z.enum([AuthProvider.CREDENTIALS, AuthProvider.GOOGLE]).optional(),
  role: z.enum([UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.ORGANIZATION]).optional(),
  reffered_by: z.string().optional(),
  isVerified: z.boolean().optional(),
});

const volunteerSchema = z.object({
  phone: z.string(),
  age: z.string(),
  bio: z.string(),
  interested_on: z.array(z.string()),
  country: z.string(),
  street_address: z.string(),
  profile_img: z.string().optional(),
  availability_date: z.object({
    start_date: z.string(),
    end_date: z.string(),
  }),
  availability_time: z.object({
    start_time: z.string(),
    end_time: z.string(),
  }),
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
};
