// In lib/models/schema.ts

import mongoose from 'mongoose';

export const UserRole = {
  VOLUNTEER: 'volunteer',
  ORGANIZATION: 'organization',
} as const;
// This prevents mongoose from trying to create the model again if it already exists
const UserModel = 
  mongoose.model('user', new mongoose.Schema({
    // NextAuth required fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: String,
    emailVerified: Date,
    
    // Role and common fields
    role: { type: String, required: true, enum: Object.values(UserRole) },
    phoneNumber: String,
    country: String,
    streetAddress: String,
    terms: { type: Boolean, required: true },
    
    // Volunteer-specific fields
    age: String,
    bio: String, // About you/About organization
    
    // Organization-specific fields
    description: String,
    organizationType: String,
    abn: String,
    website: String,
    
    // Common fields that have different meanings based on role
    volunteerTypes: [String], // What type of volunteer work you like/provide
    skills: [String], // Skills needed/offered
    
    // Availability (primarily for volunteers)
    availabilityDate: {
      startDate: String,
      endDate: String,
    },
    availabilityTime: {
      startTime: String,
      endTime: String,
    },
    
    // NextAuth and tracking fields
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }));

export default UserModel;