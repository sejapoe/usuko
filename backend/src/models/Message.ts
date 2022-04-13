import { ObjectId } from 'mongodb';
import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  users: [ObjectId];
  message: string;
  attach?: ObjectId;
}

export const MessageChema = new Schema<IMessage>(
  {
    users: { type: [ObjectId], ref: 'user', required: true },
    message: String,
    attach: { type: ObjectId, ref: 'task' },
  },
  {
    versionKey: false,
  },
);

export default model<IMessage>('message', MessageChema);
