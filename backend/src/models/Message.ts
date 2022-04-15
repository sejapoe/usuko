import { ObjectId } from 'mongodb';
import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  users: [ObjectId];
  message: string;
  attach?: ObjectId;
  sender: ObjectId;
  isReaded: boolean;
  timestamp: Date;
}

export const MessageChema = new Schema<IMessage>(
  {
    users: { type: [ObjectId], ref: 'user', required: true },
    message: String,
    attach: { type: ObjectId, ref: 'task' },
    sender: { type: ObjectId, ref: 'task' },
    isReaded: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

export default model<IMessage>('message', MessageChema);
