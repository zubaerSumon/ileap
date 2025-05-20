import { Schema, model, models } from 'mongoose';
import { IMessage } from '../interfaces/message';


const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message = models.message || model<IMessage>('message', messageSchema);

export default Message;