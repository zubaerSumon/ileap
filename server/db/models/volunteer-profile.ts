import mongoose, { Schema, model } from "mongoose";
import { IVolunteerProfile } from "../interfaces/volunteer-profile";

const VolunteerProfileSchema = new Schema<IVolunteerProfile>(
  {
    bio: {
      type: String,
      required: true,
    },
    interested_on: {
      type: [String],
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    student_type: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    home_country: {
      type: String,
    },
    course: {
      type: String,
    },
    major: {
      type: String,
    },
    major_other: {
      type: String,
    },
    referral_source: {
      type: String,
    },
    referral_source_other: {
      type: String,
    },
    availability_date: {
      start_date: { type: String },
      end_date: { type: String }
    },
    availability_time: {
      start_time: { type: String },
      end_time: { type: String }
    },
  },
  {
    timestamps: true,
  }
);

const VolunteerProfile =
  mongoose.models.volunteer_profile || model<IVolunteerProfile>("volunteer_profile", VolunteerProfileSchema);
export default VolunteerProfile;
