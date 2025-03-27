import { z } from "zod";

export const volunteerSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  availabilityDate: z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
  }),
  availabilityTime: z.object({
    startTime: z.string(),
    endTime: z.string(),
  }),
  volunteerType: z.array(z.string()).min(1, "Select at least one volunteer type"),
  termsAccepted: z.boolean(),
  age: z.number().optional(),
  phone: z.string().optional(),
  profilePhoto: z.any().optional(),
  interestedSkills: z.array(z.string()).optional(),
  skills: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
});

export type VolunteerSignupForm = z.infer<typeof volunteerSignupSchema>;