import mongoose, { Schema } from "mongoose";

const OrganizationMentorSchema: Schema = new Schema(
  {
    organization_profile: {
      type: Schema.Types.ObjectId,
      ref: "organization_profile",
      required: true
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
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
    }
  },
  { timestamps: true }
);

 OrganizationMentorSchema.index(
  { organization_profile: 1, mentor: 1 },
  { unique: true }
);

const OrganizationMentor = mongoose.models.organization_mentor || 
  mongoose.model("organization_mentor", OrganizationMentorSchema);

export default OrganizationMentor; 