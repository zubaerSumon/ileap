import mongoose, { Schema } from "mongoose";
import { IOpportunity } from "../interfaces/opportunity";

const OpportunitySchema: Schema = new Schema<IOpportunity>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: [String], required: true },
    required_skills: { type: [String], required: true },
    extra_conditions: [
      {
        question: { type: String },
        answer_type: { type: String },  
        options: { type: [String] },
      },
    ],
    commitment_type: { type: String, required: true }, 
    location: { type: String, required: true },
    number_of_volunteers: { type: Number, required: true },
    date: {
      start_date: { type: Date, required: true },
      end_date: { type: Date },
    },
    time: {
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
    },
    email_contact: { type: String, required: true },
    phone_contact: { type: String },
    internal_reference: { type: String },
    is_archived: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    is_recurring: { type: Boolean, default: false },
    recurrence: {
      type: { type: String },  
      days: { type: [String] },  
      date_range: {
        start_date: { type: Date },
        end_date: { type: Date },
      },
      time_range: {
        start_time: { type: String },
        end_time: { type: String },
      },
      occurrences: { type: Number },  
    },
    banner_img: { type: String },
    organization_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization_profile",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Add a query middleware to exclude soft-deleted documents by default
OpportunitySchema.pre('find', function() {
  this.where({ deleted_at: null });
});

OpportunitySchema.pre('findOne', function() {
  this.where({ deleted_at: null });
});

const Opportunity = mongoose.models.opportunity || mongoose.model<IOpportunity>("opportunity", OpportunitySchema);

export default Opportunity;