import { Document, Types } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description?: string;
  members: Types.ObjectId[];
  admins: Types.ObjectId[];
  createdBy: Types.ObjectId;
  isOrganizationGroup: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
} 