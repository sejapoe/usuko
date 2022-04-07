export enum EAccountType {
  Student = 0,
  Teacher = 1,
  HeadTeacher = 2,
  Admin = 3,
}
export interface IUser {
  _id: string;
  username: string;
  name: string;
  lastname: string;
  subject: string;
  password?: string;
  accountType: EAccountType;
  class: string;
  classes?: string[];
}

export interface IExtendedUser extends IUser {
  availableClasses?: string[];
}
export interface IAnswer {
  _id: string;
  user: string;
  task: string;
  files: string[];
  mark: number;
}

export interface IClass {
  _id: string;
  num: number;
  liter: string;
  pupils: string[];
  tasks?: string[];
  teachers?: string[];
}

export interface IExtendedClass extends IClass {
  text: string;
  value: string;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  deadline: Date;
  classes: string[];
  teacher?: string;
  files: string[];
  answers: string[];
}

export interface IExtendedTask extends ITask {
  date?: Date;
  time?: string;
  deadlineString?: string;
  classesFormated?: string;
  totalStudents?: number;
}

import VueRouter, { Route } from 'vue-router';

export interface IVueRouter {
  $router: VueRouter;
  $route: Route;
}

import { BvModal } from 'bootstrap-vue';

export interface IBVModal {
  $bvModal: BvModal;
}
