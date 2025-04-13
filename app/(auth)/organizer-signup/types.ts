import { z } from "zod";

export const organizerSignupSchema = z.object({
  // Step 1
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  
  // Step 2
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),

  // Step 3 - Organization specific fields
  organizationName: z.string().min(2, "Organization name is required"),
  organizationDescription: z.string().min(10, "Please provide more details about your organization"),
  organizationLogo: z.any().optional(),
  website: z.string().url().optional(),
  organizationPhone: z.string().optional(),
});

export type OrganizerSignupForm = z.infer<typeof organizerSignupSchema>;