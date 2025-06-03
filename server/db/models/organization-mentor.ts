import mongoose, { Schema } from "mongoose";
import { IOrganizationMentor } from "../interfaces/organization-mentor";

const OrganizationMentorSchema: Schema = new Schema<IOrganizationMentor>(
  {
    organization_profile: {
      type: Schema.Types.ObjectId,
      ref: "organization_profile",
      required: true
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: false,
      sparse: true
    },
    invited_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    invitation_token: {
      type: String,
      required: true
    },
    invitation_expires: {
      type: Date,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  { 
    timestamps: true,
    strict: true
  }
);

// Only create unique index for accepted invitations
OrganizationMentorSchema.index(
  { organization_profile: 1, mentor: 1 },
  { 
    unique: true,
    sparse: true,
    partialFilterExpression: { status: "accepted" }
  }
);

const OrganizationMentor = mongoose.models.organization_mentor || 
  mongoose.model<IOrganizationMentor>("organization_mentor", OrganizationMentorSchema);

export default OrganizationMentor; 