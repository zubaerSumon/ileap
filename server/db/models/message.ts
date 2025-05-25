import { Schema, model, models } from 'mongoose';
import { IMessage } from '../interfaces/message';

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: false,
      index: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'group',
      required: false,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readBy: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ group: 1 });
messageSchema.index({ 'readBy.user': 1 });

export const Message = models.message || model('message', messageSchema);