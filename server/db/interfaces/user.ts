import { Document, ObjectId } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  VOLUNTEER = "volunteer",
  ORGANIZATION = "organization", 
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
  referred_by: ObjectId;
}
