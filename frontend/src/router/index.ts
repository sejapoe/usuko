import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
// import Home from '../views/Home.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
import TeacherManagement from '@/components/TeacherManagement.vue';
import AccountManagement from '@/components/AccountManagement.vue';
import ClassManagement from '@/components/ClassManagement.vue';
import TaskManagement from '@/components/TaskManagement.vue';
import TaskList from '@/components/TaskList.vue';
import Diary from '@/components/Diary.vue';
import Journal from '@/components/Journal.vue';

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
      { path: 'admin/teachers', component: TeacherManagement },
      { path: 'admin/accounts', component: AccountManagement },
      { path: 'admin/classes', component: ClassManagement },
      { path: 'teacher/tasks', component: TaskManagement },
      {
        path: 'teacher/tasks/:id',
        component: TaskManagement,
      },
      { path: 'teacher/journal', component: Journal },
      { path: 'student/tasks', component: TaskList },
      {
        path: 'student/tasks/:id',
        component: TaskList,
      },
      {
        path: 'student/diary',
        component: Diary,
      },
      { path: 'chat', component: ClassManagement },
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
