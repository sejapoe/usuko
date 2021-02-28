import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export enum EAccountType {
  Student = 0,
  Teacher = 1,
  HeadTeacher = 2,
  Admin = 3,
}

export interface IUser extends Document {
  username: string;
  name: string;
  lastname: string;
  subject: string;
  password: string;
  accountType: EAccountType;
  comparePasswords(candidatePassword: string): boolean;
}

export const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    name: String,
    lastname: String,
    subject: String,
    password: { type: String, required: true },
    accountType: {
      type: String,
      default: EAccountType.Student,
      enum: Object.values(EAccountType),
    },
  },
  {
    versionKey: false,
  },
);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);

  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.comparePasswords = function (candidatePassword: string): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

export default model<IUser>('user', UserSchema);
