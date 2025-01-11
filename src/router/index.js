import { createRouter, createWebHistory } from 'vue-router';
import TestConnection from '@/views/TestConnection.vue';

const routes = [
  { path: '/test-connection', 
    name: 'TestConnection', 
    component: TestConnection },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
