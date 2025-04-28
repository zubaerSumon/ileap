import mongoose, { Schema, model } from "mongoose";
import { IVolunteer } from "../interfaces/volunteer";

const VolunteerSchema = new Schema<IVolunteer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    referral_source: {
      type: String,
    },
    referral_source_other: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Volunteer = mongoose.models.volunteer ||model<IVolunteer>("volunteer", VolunteerSchema);