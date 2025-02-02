import { createRouter, createWebHistory } from 'vue-router';
import TestConnection from '@/views/TestConnection.vue';
import LandingPage from '@/views/LandingPage.vue';
import EventDetail from '@/views/EventDetail.vue';
import Login from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import EventEdit from '@/views/EventEdit.vue';
import InscriptionPage from '@/views/InscriptionPage.vue';

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
    path: '/events/:name',  // Ruta para el detalle del evento
    name: 'event-detail',
    component: EventDetail,
    props: true, // Esto permite pasar el `name` como prop
    children: [
      {
        path: 'inscription',  // Ruta hija de /events/:name
        name: 'event-inscription',
        component: InscriptionPage, // Asegúrate de crear esta vista
        props: true, // Esto permite pasar el parámetro `name` a la inscripción
      }
    ]
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
