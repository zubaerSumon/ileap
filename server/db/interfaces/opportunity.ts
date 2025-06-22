import { Document, Types } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  description: string;
  category: string[];
  required_skills: string[];
  commitment_type: string; 
  location: string;
  number_of_volunteers: number;
  email_contact: string;
  phone_contact: string;
  internal_reference?: string;
  start_date: Date;
  start_time: string;
  is_archived: boolean;
  deleted_at: Date | null;
  is_recurring: boolean;
  recurrence?: {
    type: string; // 'daily', 'weekly', 'monthly', 'yearly'
    days?: string[]; // ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    date_range: {
      start_date: Date;
      end_date?: Date;
    };
    time_range: {
      start_time: string;
      end_time: string;
    };
    occurrences?: number; // Number of occurrences before ending
  };
  banner_img: string;
  organization_profile: Types.ObjectId;  
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}