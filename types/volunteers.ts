import { volunteerValidation } from "@/server/modules/volunteers/volunteers.valdation";


export type VolunteerProfileFormData = typeof volunteerValidation.updateVolunteerProfileSchema;