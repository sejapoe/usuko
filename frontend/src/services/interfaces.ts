export enum EAccountType {
  Student = 0,
  Teacher = 1,
  HeadTeacher = 2,
  Admin = 3,
}
export interface IUser {
  username: string;
  type: EAccountType;
}

import VueRouter, { Route } from 'vue-router';

export interface IVueRouter {
  $router: VueRouter;
  $route: Route;
}
