import { z } from "zod";
import { UserRole } from "@/lib/models/schema";

export const volunteerSignupSchema = z.object({

  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.literal(UserRole.VOLUNTEER).default(UserRole.VOLUNTEER),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  streetAddress: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
  
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().optional(),
  bio: z.string().optional(),
  volunteerTypes: z.string().optional(),
  availabilityDate: z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
  }).optional(),
  availabilityTime: z.object({
    startTime: z.string(),
    endTime: z.string(),
  }).optional(),
});

export type VolunteerSignupForm = z.infer<typeof volunteerSignupSchema>;