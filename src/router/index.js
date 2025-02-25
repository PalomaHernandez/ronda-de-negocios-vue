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
import ParticipantsMeetings from '@/views/ParticipantsMeetings.vue';
import EventStatistics from '@/views/EventStatistics.vue';

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPage,
  },
  {
    path: '/:slug',
    name: 'event-detail',
    component: EventDetail,
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
  },
  {
    path: '/:slug/notificaciones',
    name: 'event-notifications',
    component: NotificationsPage,
  },
  {
    path: '/:slug/mis-reuniones',
    name: 'event-meetings',
    component: MeetingsPage,
  },
  {
    path: '/:slug/invitaciones',
    name: 'event-invitations',
    component: InvitationsPage,
  },
  {
    path: '/:slug/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/:slug/registro',
    name: 'register',
    component: RegisterPage,
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
  {
    path: '/:slug/reuniones',
    name: 'participants-meetings',
    component: ParticipantsMeetings,
  },
  {
    path: '/event/:slug/statistics',
    name: 'event-statistics',
    component: EventStatistics,
    /*meta: {
      requiresAuth: true,
      role: 'responsible' // Solo accesible por el responsable
    }*/
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const eventStore = useEventStore();
  const eventSlug = to.params.slug;

  const isAuthenticated = authStore.isAuthenticated;
  const isRegistered = authStore.isRegistered;
  const isResponsible = authStore.isResponsible;
  const storedEventSlug = authStore.currentEventSlug;

  if (isAuthenticated && storedEventSlug && storedEventSlug !== eventSlug) {
    authStore.logout(eventSlug);
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if(!isAuthenticated && to.name !== 'login' && to.name !== 'register' && to.name !== 'event-detail'){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if (to.name !== 'event-inscription' && !isRegistered && isAuthenticated && !isResponsible) {
      return { name: 'event-inscription', params: { slug: eventSlug } };
  }

  if(to.name === 'event-inscription' && (isRegistered || isResponsible)){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if((to.name === 'profile' || to.name === 'edit-profile' || to.name === 'event-notifications' || to.name === 'event-invitations' || to.name === 'event-meetings') && isResponsible){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if((to.name === 'participants' || to.name === 'event-edit' || to.name === 'participants-meetings') && !isResponsible){
    return { name: 'event-detail', params: { slug: eventSlug } };
  }

  if (to.name === 'event-detail' && from?.name === 'event-inscription' && !isRegistered && isAuthenticated) {
    return false;
  }

  if(to.name === 'event-statistics' && !isResponsible && eventStore.evento.status !== "Terminado"){
    return false;
  }
  
});


export default router;
