import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import { useEventStore } from "@/stores/event";
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
import EditProfile from '@/views/EditProfile.vue';
import ParticipantsPage from '@/views/ParticipantsPage.vue';

const routes = [
  
  {
    path: '/:slug',
    name: 'event-detail',
    component: EventDetail,
    props: true,
  },
  {
    path: '/:slug/editar',
    name: 'event-edit',
    component: EventEdit,
    props: true,
  },
  {
    path: '/:slug/inscripcion',
    name: 'event-inscription',
    component: InscriptionPage,
    props: true,
  },
  {
    path: '/:slug/notificaciones',
    name: 'event-notifications',
    component: NotificationsPage,
    props: true,
  },
  {
    path: '/:slug/reuniones',
    name: 'event-meetings',
    component: MeetingsPage,
    props: true,
  },
  {
    path: '/:slug/invitaciones',
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
    path: '/:slug/registro',
    name: 'register',
    component: RegisterPage,
    props: true,
  },
  {
    path: '/:slug/perfil',
    name: 'profile',
    component: UserProfile,
  },
  {
    path: '/:slug/perfil/editar',
    name: 'edit-profile',
    component: EditProfile,
  },
  {
    path: '/:slug/participantes',
    name: 'participants',
    component: ParticipantsPage,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const eventSlug = to.params.slug;

  const isAuthenticated = authStore.isAuthenticated;
  const isRegistered = authStore.registered;
  const isResponsible = authStore.responsible;

  if(!isAuthenticated && to.name !== 'login' && to.name !== 'register' && to.name !== 'event-detail'){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if (to.name !== 'event-inscription' && !isRegistered && isAuthenticated && !isResponsible) {
    return { name: 'event-inscription', params: { slug: eventSlug } };
  }

  if(to.name === 'event-inscription' && (isRegistered || isResponsible)){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if((to.name === 'profile' || to.name === 'edit-profile' || to.name === 'event-notifications') && isResponsible){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if((to.name === 'participants' || to.name === 'event-edit') && !isResponsible){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if (to.name === 'event-detail' && from?.name === 'event-inscription' && !isRegistered && isAuthenticated) {
    return false;
  }
  
});


export default router;
