import { createRouter, createWebHistory } from 'vue-router';
import TestConnection from '@/views/TestConnection.vue';
import LandingPage from '@/views/LandingPage.vue';
import EventDetail from '@/views/EventDetail.vue';
import Login from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import EventEdit from '@/views/EventEdit.vue';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },

  {
    path: '/test-connection',
    name: 'TestConnection',
    component: TestConnection
  },

  {
    path: '/events/:name', // Ahora la URL utilizará el nombre del evento
    name: 'event-detail',
    component: EventDetail,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/events/:name/edit', // Ahora la URL utilizará el nombre del evento
    name: 'event-edit',
    component: EventEdit,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
