import { z } from "zod";

const createOpportunitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  required_skills: z.array(z.string()).min(1, "At least one skill is required"),
  extra_conditions: z.array(z.object({
    question: z.string(),
    answer_type: z.string(),
    options: z.array(z.string()).optional()
  })).optional(),
  commitment_type: z.string().min(1, "Commitment type is required"),
  location: z.string().min(1, "Location is required"),
  number_of_volunteers: z.number().min(1, "Number of volunteers must be at least 1"),
  date: z.object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional()
  }),
  time: z.object({
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required")
  }),
  email_contact: z.string().email("Invalid email address"),
  phone_contact: z.string().optional(),
  internal_reference: z.string().optional(),
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
  }).optional()
});

export const opportunityValidation = {
  createOpportunitySchema
}; 
