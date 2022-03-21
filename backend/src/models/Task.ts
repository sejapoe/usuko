import { Schema, model, Document, ObjectId, PopulatedDoc } from 'mongoose';
import { IAnswer } from './Answer';

export interface ITask extends Document {
  title: string;
  description: string;
  deadline: Date;
  classes: ObjectId[];
  teacher: ObjectId;
  files: string[];
  answers: PopulatedDoc<IAnswer & Document>[];
}

export const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: String,
    deadline: Date,
    classes: [{ type: Schema.Types.ObjectId, ref: 'class' }],
    teacher: { type: Schema.Types.ObjectId, ref: 'user' },
    files: [String],
    answers: [{ type: Schema.Types.ObjectId, ref: 'answer' }],
  },
  {
    versionKey: false,
  },
);

export default model<ITask>('task', TaskSchema);
