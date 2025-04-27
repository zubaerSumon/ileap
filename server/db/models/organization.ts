import mongoose, { Schema } from "mongoose";
import { IOrgnization } from "../interfaces/organization";

const OrganizationSchema: Schema = new Schema<IOrgnization>(
  {
    phone_number: { type: String },
    bio: { type: String },
    type: { type: String },
    opportunity_types: { type: [String] },
    required_skills: { type: [String] },
    state: { type: String },
    area: { type: String },
    abn: { type: String },
    website: { type: String },
    profile_img: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.models.organization || mongoose.model<IOrgnization>("organization", OrganizationSchema);

export default Organization;