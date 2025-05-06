import { z } from "zod";

const updateVolunteerProfileSchema = z.object({
  name: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  interested_on: z.array(z.string()).optional(),
  state: z.string().optional(),
  area: z.string().optional(),
});

export const volunteerValidation = {
  updateVolunteerProfileSchema,
};
