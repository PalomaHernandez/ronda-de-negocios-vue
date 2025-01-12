import { createRouter, createWebHistory } from 'vue-router';
import TestConnection from '@/views/TestConnection.vue';
import LandingPage from '@/views/LandingPage.vue';
import EventDetail from '@/views/EventDetail.vue';
const routes = [
  { path: '/', 
    name: 'LandingPage', 
    component: LandingPage },

  { path: '/test-connection', 
    name: 'TestConnection', 
    component: TestConnection },
  
  {
    path: '/events/:name', // Ahora la URL utilizará el nombre del evento
    name: 'event-detail',
    component: EventDetail,
    props: true, // Esto permite pasar el `name` como prop
  },

      
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
