import { z } from 'zod';
import mongoose from 'mongoose';

export const UserRole = {
  VOLUNTEER: 'volunteer',
  ORGANIZATION: 'organization',
} as const;

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum([UserRole.VOLUNTEER, UserRole.ORGANIZATION]),
  image: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  }),
  volunteerType: z.array(z.string()).optional(),
  availabilityDate: z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
  }).optional(),
  availabilityTime: z.object({
    startTime: z.string(),
    endTime: z.string(),
  }).optional(),
});

export const opportunitySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  organization: z.string(), // Organization ID
  location: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  skills: z.array(z.string()),
  status: z.enum(['open', 'closed']),
  applicants: z.array(z.string()).optional(), // Array of Volunteer IDs
});

export const messageSchema = z.object({
  sender: z.string(), // User ID
  receiver: z.string(), // User ID
  content: z.string(),
  opportunityId: z.string().optional(),
  createdAt: z.date(),
});

// Mongoose Models
const UserModel = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(UserRole) },
  image: String,
  bio: String,
  location: String,
  terms: { type: Boolean, required: true },
  volunteerType: [String],
  availabilityDate: {
    startDate: String,
    endDate: String,
  },
  availabilityTime: {
    startTime: String,
    endTime: String,
  },
  createdAt: { type: Date, default: Date.now },
}));

const OpportunityModel = mongoose.model('Opportunity', new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  skills: [String],
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
}));

const MessageModel = mongoose.model('Message', new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
  createdAt: { type: Date, default: Date.now },
}));

export { UserModel, OpportunityModel, MessageModel };