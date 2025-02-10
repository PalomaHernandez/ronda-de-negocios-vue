import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/LandingPage.vue';
import EventDetail from '@/views/EventDetail.vue';
import Login from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import InscriptionPage from '@/views/InscriptionPage.vue';
import NotificationsPage from '@/views/NotificationsPage.vue';
import MeetingsPage from '@/views/MeetingsPage.vue';
import InvitationsPage from '@/views/InvitationsPage.vue';
import EventEdit from '@/views/EventEdit.vue';
import UserProfile from '@/views/UserProfile.vue';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/:slug', 
    name: 'event-detail',
    component: EventDetail,
    props: true,
  },
  {
    path: '/:slug/edit',
    name: 'event-edit',
    component: EventEdit,
    props: true,
  },
  {
    path: '/:slug/inscription',
    name: 'event-inscription',
    component: InscriptionPage,
    props: true, 
  },
  {
    path: '/:slug/notifications', 
    name: 'event-notifications',
    component: NotificationsPage,
    props: true, 
  },
  {
    path: '/:slug/meetings',
    name: 'event-meetings',
    component: MeetingsPage,
    props: true, 
  },
  {
    path: '/:slug/invitations', 
    name: 'event-invitations',
    component: InvitationsPage,
    props: true, 
  },
  {
    path: '/:slug/login',
    name: 'login',
    component: Login,
    props: true, 
  },
  {
    path: '/:slug/register',
    name: 'register',
    component: RegisterPage,
    props: true, 
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfile,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
