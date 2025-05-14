import { Document } from "mongoose";

export interface IVolunteerProfile extends Document {
  // Basic Profile (Step 2)
  bio: string;
  interested_on: string[];
  phone_number: string;
  country: string;
  state: string;
  area: string;
  postcode: string;

  // Student Details (Optional Step 3)
  student_type?: "yes" | "no";
  home_country?: string;
  course?: string;
  major?: string;
  major_other?: string;
  referral_source?: string;
  referral_source_other?: string;

  // Additional Fields
  profile_img?: string;
  availability_date?: {
    start_date?: string;
    end_date?: string;
  };
  availability_time?: {
    start_time?: string;
    end_time?: string;
  };
  applied_events?:string[];
   createdAt: Date;
  updatedAt: Date;
}
