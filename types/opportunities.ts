import { opportunityValidation } from "@/server/modules/opportunity/opportunities.validation";
import { z } from "zod";

export type CreateOpportunityInput = z.infer<typeof opportunityValidation.createOpportunitySchema>;

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  category: string[];
  required_skills: string[];
  extra_conditions?: {
    question: string;
    answer_type: string;
    options?: string[];
  }[];
  commitment_type: string;
  location: string;
  number_of_volunteers: number;
  date: {
    start_date: Date;
    end_date?: Date;
  };
  time: {
    start_time: string;
    end_time: string;
  };
  email_contact: string;
  phone_contact?: string;
  internal_reference?: string;
  organization: {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
  };
  is_recurring: boolean;
  recurrence?: {
    type: string;
    days?: string[];
    date_range: {
      start_date: Date;
      end_date?: Date;
    };
    time_range: {
      start_time: string;
      end_time: string;
    };
    occurrences?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}; 