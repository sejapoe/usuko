import { Schema, model, Document } from 'mongoose';

export interface IClass extends Document {
  num: number;
  liter: string;
  tasks: string[];
  pupils: string[];
}

export const ClassSchema = new Schema<IClass>(
  {
    num: { type: Number, required: true },
    liter: String,
    tasks: [String],
    pupils: [String],
  },
  {
    versionKey: false,
  },
);

export default model<IClass>('class', ClassSchema);
