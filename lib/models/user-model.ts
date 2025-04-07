/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Model, Schema } from 'mongoose';

export const UserRole = {
  VOLUNTEER: 'volunteer',
  ORGANIZATION: 'organization',
} as const;

// Define interfaces for the profiles
interface IVolunteerProfile {
  name: string;
  skills?: string;
  age: string;
  phone_number: string;
  country: string;
  street_address: string;
  profile_photo?: string;
  bio?: string;
  availability_date?: string;
  availability_time?: string;
}

interface IOrganizerProfile {
  organization_name: string;
  about_organization: string;
  organization_type: string;
  phone_number: string;
  country_state: string;
  street_address: string;
  abn?: string;
  profile_photo?: string;
  volunteer_work_types: string[];
  skills_required: string[];
  website_link?: string;
}

// Define interface for the user document
interface IUser extends Document {
  email: string;
  password: string;
  role: typeof UserRole[keyof typeof UserRole];
  terms: boolean;
  created_at: Date;
  updated_at: Date;
  volunteer_profile?: IVolunteerProfile;
  organizer_profile?: IOrganizerProfile;
  email_verified?: Date;
  image?: string;
  accounts?: mongoose.Types.ObjectId[];
  sessions?: mongoose.Types.ObjectId[];
}

const volunteerProfileSchema = new mongoose.Schema<IVolunteerProfile>({
  name: { type: String, required: true },
  skills: { type: String},
  age: { type: String, required: true },
  phone_number: { type: String, required: true },
  country: { type: String, required: true },
  street_address: { type: String, required: true },
  profile_photo: String,
  bio: String,
  availability_date: String,
  availability_time: String,
}, { _id: false });


const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(UserRole) },
  terms: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  volunteer_profile: {
    type: volunteerProfileSchema,
    required: function(this: { role: string }) {
      return this.role === UserRole.VOLUNTEER;
    },
    validate: {
      validator: function(this: { role: string }, value: any) {
        return this.role !== UserRole.VOLUNTEER || value != null;
      },
      message: 'Volunteer profile is required for volunteer users'
    }
  },
  organizer_profile: {
    type: organizerProfileSchema,
    required: function(this: { role: string }) {
      return this.role === UserRole.ORGANIZATION;
    },
    validate: {
      validator: function(this: { role: string }, value: any) {
        return this.role !== UserRole.ORGANIZATION || value != null;
      },
      message: 'Organization profile is required for organization users'
    }
  },
  email_verified: Date,
  image: String,
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
});

let UserModel: Model<IUser>;

try {
  // Check if model exists first
  UserModel = mongoose.models.user as Model<IUser>;
} catch {
  // If model doesn't exist, create it
  UserModel = mongoose.model<IUser>('user', userSchema);
}


const User = mongoose.models.user || mongoose.model<IUser>('user', UserSchema);

export default User;