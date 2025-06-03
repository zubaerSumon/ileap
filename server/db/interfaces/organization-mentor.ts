import { Document, Types } from "mongoose";

export interface IOrganizationMentor extends Document {
  organization_profile: Types.ObjectId;
  mentor?: Types.ObjectId;
  invited_by: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  invitation_token: string;
  invitation_expires: Date;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
} 