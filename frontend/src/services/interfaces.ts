export enum EAccountType {
  Student = 0,
  Teacher = 1,
  HeadTeacher = 2,
  Admin = 3,
}
export interface IUser {
  username: string;
  name: string;
  lastname: string;
  subject: string;
  type: EAccountType;
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
