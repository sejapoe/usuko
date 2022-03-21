import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IAnswer extends Document {
  user: ObjectId;
  task: ObjectId;
  files: string[];
  mark: number;
}

export const AnswerSchema = new Schema<IAnswer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    task: { type: Schema.Types.ObjectId, ref: 'task' },
    files: [String],
    mark: Number,
  },
  {
    versionKey: false,
  },
);

export default model<IAnswer>('answer', AnswerSchema);
