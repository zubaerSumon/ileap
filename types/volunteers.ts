import { volunteerValidation } from "@/server/modules/volunteer-profile/volunteer-profile.valdation";


export type VolunteerProfileFormData = typeof volunteerValidation.updateVolunteerProfileSchema;