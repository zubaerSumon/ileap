import { Document} from "mongoose";
import mongoose from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  VOLUNTEER = "volunteer",
  ORGANIZATION = "organization", 
  MENTOR = "mentor"
}

export enum AuthProvider {
  CREDENTIALS = "credentials",
  GOOGLE = "google",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  provider: AuthProvider;
  is_verified: boolean;
  referred_by: string;
  volunteer_profile?: mongoose.Types.ObjectId;
  organization_profile?: mongoose.Types.ObjectId;
}
