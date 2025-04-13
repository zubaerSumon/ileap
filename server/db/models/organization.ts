import mongoose, { Schema } from "mongoose";
import { IOrgnization } from "../interfaces/organization";

const OrganizationSchema: Schema = new Schema<IOrgnization>(
  {
    phone: { type: String },
    bio: { type: String },
    type: { type: String },
    categories: { type: [String] },
    skills_required: { type: [String] },
    country: { type: String },
    street_address: { type: String },
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