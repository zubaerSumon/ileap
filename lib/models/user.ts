/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Schema } from 'mongoose';

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
  availability_date?: {
    startDate: string;
    endDate?: string;
  };
  availability_time?: {
    startTime: string;
    endTime: string;
  };
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

const volunteerProfileSchema = new Schema<IVolunteerProfile>({
  name: { type: String, required: true },
  skills: { type: String},
  age: { type: String, required: true },
  phone_number: { type: String, required: true },
  country: { type: String, required: true },
  street_address: { type: String, required: true },
  profile_photo: String,
  bio: String,
  availability_date: {
    startDate: String,
    endDate: String,
  },
  availability_time: {
    startTime: String,
    endTime: String,
  },
}, { _id: false });

const organizerProfileSchema = new Schema<IOrganizerProfile>({
  organization_name: { type: String, required: true },
  about_organization: { type: String, required: true },
  organization_type: { type: String, required: true },
  phone_number: { type: String, required: true },
  country_state: { type: String, required: true },
  street_address: { type: String, required: true },
  abn: String,
  profile_photo: String,
  volunteer_work_types: { type: [String], required: true },
  skills_required: { type: [String], required: true },
  website_link: String,
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
},{timestamps: true});

const User = mongoose?.models?.user || mongoose.model<IUser>('user', userSchema);

export default User;