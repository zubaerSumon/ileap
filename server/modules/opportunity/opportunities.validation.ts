import { z } from "zod";

const createOpportunitySchema = z.object({
  title: z.string().min(1, "Please enter a title for your opportunity"),
  description: z.string().min(1, "Please provide a description of your opportunity"),
  category: z.array(z.string()).min(1, "Please select at least one category"),
  required_skills: z.array(z.string()).min(1, "Please select at least one required skill"),
  commitment_type: z.string().min(1, "Please select a commitment type"),
  location: z.string().min(1, "Please enter a location"),
  number_of_volunteers: z.coerce.number().min(1, "Number of volunteers must be at least 1"),
  email_contact: z.string().email("Please enter a valid email address"),
  phone_contact: z.string().optional(),
  internal_reference: z.string().optional(),
  start_date: z.string().optional(),
  start_time: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurrence: z.object({
    type: z.string(),
    days: z.array(z.string()).optional(),
    date_range: z.object({
      start_date: z.string(),
      end_date: z.string().optional()
    }),
    time_range: z.object({
      start_time: z.string(),
      end_time: z.string()
    }),
    occurrences: z.number().optional()
  }).optional(),
  banner_img: z.string().optional()
});

export const opportunityValidation = {
  createOpportunitySchema
}; 
