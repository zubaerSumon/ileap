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
