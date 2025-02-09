import { createRouter, createWebHistory } from 'vue-router';
import TestConnection from '@/views/TestConnection.vue';
import LandingPage from '@/views/LandingPage.vue';
import EventDetail from '@/views/EventDetail.vue';
import Login from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import InscriptionPage from '@/views/InscriptionPage.vue';
import NotificationsPage from '@/views/NotificationsPage.vue';
import MeetingsPage from '@/views/MeetingsPage.vue';
import InvitationsPage from '@/views/InvitationsPage.vue';

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
    path: '/:name',  // Ruta para el detalle del evento
    name: 'event-detail',
    component: EventDetail,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/:name/inscription', // Ahora la URL utilizará el nombre del evento
    name: 'event-inscription',
    component: InscriptionPage,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/:name/notifications', // Ahora la URL utilizará el nombre del evento
    name: 'event-notifications',
    component: NotificationsPage,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/:name/meetings', // Ahora la URL utilizará el nombre del evento
    name: 'event-meetings',
    component: MeetingsPage,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/:name/invitations', // Ahora la URL utilizará el nombre del evento
    name: 'event-invitations',
    component: InvitationsPage,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/:name/login',
    name: 'login',
    component: Login,
    props: true, // Esto permite pasar el `name` como prop
  },
  {
    path: '/:name/register',
    name: 'register',
    component: RegisterPage,
    props: true, // Esto permite pasar el `name` como prop
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
