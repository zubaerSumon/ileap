import { z } from "zod";

const updateVolunteerProfileSchema = z.object({
  name: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  interested_on: z.array(z.string()).optional(),
  state: z.string().optional(),
  area: z.string().optional(),
  postcode: z.string().optional(),
  availability_date: z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional()
  }).optional()
});

const applyToOpportunitySchema = z.object({
  opportunityId: z.string(),
});

const getApplicationStatusSchema = z.object({
  opportunityId: z.string(),
});

export const volunteerValidation = {
  updateVolunteerProfileSchema,
  applyToOpportunitySchema,
  getApplicationStatusSchema,
};
