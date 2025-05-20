import { Types } from 'mongoose';

export interface IMessage {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  isRead: boolean;
}