import { Types } from "mongoose";
export interface IOrgnization extends Document {
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
  user: Types.ObjectId;
}
