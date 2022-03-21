import { Schema, model, Document, ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import Class from './Class';

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
  class: ObjectId;
  classes: string[];
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
    class: { type: Schema.Types.ObjectId, ref: 'class' },
    classes: [String],
  },
  {
    versionKey: false,
  },
);

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

UserSchema.post(/(save|updateOne)/, function () {
  updatePupilsInClasses();
});

UserSchema.methods.comparePasswords = function (candidatePassword: string): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const m = model<IUser>('user', UserSchema);
export default m;

function updatePupilsInClasses() {
  Class.find().then(classes => {
    classes.forEach(cl => (cl.pupils = []));
    classes.forEach(cl => (cl.teachers = []));
    m.find().then(users => {
      users.forEach(u => {
        if (u.class) {
          classes.find(cl => cl._id == u.class)?.pupils.push(u._id);
        }
        u.classes.forEach(c => classes.find(cl => cl._id == c)?.teachers.push(u._id));
      });
      classes.forEach(cl => cl.save());
    });
  });
}
