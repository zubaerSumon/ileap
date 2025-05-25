import { Schema, model, models } from 'mongoose';

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    }],
    admins: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    }],
    avatar: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

groupSchema.index({ members: 1 });
groupSchema.index({ createdBy: 1 });

export const Group = models.group || model('group', groupSchema); 