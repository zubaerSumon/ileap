import { opportunityValidation } from "@/server/modules/opportunity/opportunities.validation";
import { userValidation } from "@/server/modules/users/users.validation";
import { z } from "zod";

export type CreateOpportunityInput = z.infer<
  typeof opportunityValidation.createOpportunitySchema
>;

export type Opportunity = CreateOpportunityInput & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  organization_profile: z.infer<
    typeof userValidation.organizationProfileSchema
  > & {
    _id: string;
  };
  applicantCount?: number;
  recruitCount?: number;
  is_archived: boolean;
};
export interface TabConfig {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

export type OpportunityDetails = {
  id: string;
  title: string;
  organization: {
    title: string;
    id: string;
  };
  location: string;
}; 
