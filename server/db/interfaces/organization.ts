import { Types } from "mongoose";
export interface IOrgnization extends Document {
  phone: string;
  bio: string;
  type: string;
  categories: string[];
  skills_required: string[];
  country: string;
  street_address: string;
  abn: string;
  website: string;
  profile_img: string;
  user: Types.ObjectId;
}
