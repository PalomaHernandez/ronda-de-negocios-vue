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
    path: '/:slug/profile',
    name: 'profile',
    component: UserProfile,
  },
  {
    path: '/:slug/profile/edit',
    name: 'edit-profile',
    component: EditProfile,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const eventStore = useEventStore();
  const eventSlug = to.params.slug;

  if (!authStore.isAuthenticated) {
    if (to.name !== 'login' && to.name !== 'register' && from.name !== 'event-detail' && to.name !== 'event-detail') {
      return { name: 'event-detail', params: { slug: eventSlug } };
    }
  } else {

    const isResponsible = authStore.responsible;

    if (!isResponsible) {
      const isRegistered = authStore.registered;
      if (!isRegistered) {
        if (to.name !== 'event-inscription') {
          return { name: 'event-inscription', params: { slug: eventSlug } };
        }
      } else {
        if (to.name === 'event-inscription') {
          if (from.name !== 'event-detail') {
            return { name: 'event-detail', params: { slug: eventSlug } };
          }
        }
        if (to.name === 'login') {
          if (from.name !== 'event-detail') {
            return { name: 'event-detail', params: { slug: eventSlug } };
          }
        }
      }
    }
  }
});


export default router;
