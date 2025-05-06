import mongoose, { Schema } from "mongoose";
import { IVolunteer } from "../interfaces/volunteer";

const VolunteerSchema: Schema = new Schema<IVolunteer>(
  {
    phone: { type: String },
    age: { type: String },
    bio: { type: String },
    interested_on: { type: [String] },
    country: { type: String },
    street_address: { type: String },
    profile_img: { type: String },
    availability_date: {
      start_date: { type: String },
      end_date: { type: String },
    },
    availability_time: {
      start_time: { type: String },
      end_time: { type: String },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Volunteer = mongoose.models.volunteer || mongoose.model<IVolunteer>("volunteer", VolunteerSchema);

export default Volunteer;