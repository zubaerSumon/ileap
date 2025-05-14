import { Document, Types } from "mongoose";

export interface IOrgnizationPofile extends Document {
  user: Types.ObjectId;
  phone_number: string;
  bio: string;
  type: string;
  opportunity_types: string[];
  required_skills: string[];
  state: string;
  area: string;
  abn: string;
  website: string;
  profile_img: string;
  cover_img: string;
}
