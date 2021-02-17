export interface IUser {
  username: string;
}

import VueRouter, { Route } from 'vue-router';

export interface IVueRouter {
  $router: VueRouter;
  $route: Route;
}
