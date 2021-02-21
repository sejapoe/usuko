import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
// import Home from '../views/Home.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    // component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    children: [{ path: 'foo' }, { path: 'bar' }, { path: 'baz' }],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
