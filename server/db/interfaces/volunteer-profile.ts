import { Document } from "mongoose";

export interface IVolunteerProfile extends Document {
  bio: string;
  interested_on: string[];
  phone_number: string;
  country: string;
  state: string;
  area: string;
  postcode: string;

  student_type?: "yes" | "no";
  home_country?: string;
  course?: string;
  major?: string;
  major_other?: string;
  referral_source?: string;
  referral_source_other?: string;

  profile_img?: string;
  availability_date?: {
    start_date?: string;
    end_date?: string;
  };
  availability_time?: {
    start_time?: string;
    end_time?: string;
  };
  is_available?: boolean;
}
