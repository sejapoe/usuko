import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
// import Home from '../views/Home.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
import TeacherManagement from '@/components/TeacherManagement.vue';
import AccountManagement from '@/components/AccountManagement.vue';
import ClassManagement from '@/components/ClassManagement.vue';

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
    children: [
      { path: 'foo', component: TeacherManagement },
      { path: 'bar', component: AccountManagement },
      { path: 'baz', component: ClassManagement },
    ],
  },
  {
    path: '/error',
    name: 'Error',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
