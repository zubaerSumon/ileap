import mongoose, { Schema } from "mongoose";
import { IOrgnizationPofile } from "../interfaces/organization-profile";

const OrganizationProfileSchema: Schema = new Schema<IOrgnizationPofile>(
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
    cover_img: { type: String },
  },
  { timestamps: true }
);

const OrganizationProfile = mongoose.models.organization_profile || mongoose.model<IOrgnizationPofile>("organization_profile", OrganizationProfileSchema);

export default OrganizationProfile;