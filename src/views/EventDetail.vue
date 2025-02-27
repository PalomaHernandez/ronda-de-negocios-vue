<template>
  <LayoutPage>
    <template #default>
      <Loading v-if="loading" />
      <div v-else-if="evento">
        <div v-if="success" class="alert alert-success" @click="eventStore.clearMessages()">{{ success }}</div>
        <div v-if="error" class="alert alert-danger" @click="eventStore.clearMessages()">{{ error }}</div>
        <div v-if="info" class="alert alert-info" @click="eventStore.clearMessages()">{{ info }}</div>
        <div v-if="auth_info" class="alert alert-info" @click="authStore.clearMessages()">{{ auth_info }}</div>

        <div v-if="isResponsible" class="mb-8 flex justify-end space-x-4">
          <RouterLink :to="{ name: 'event-edit', params: { slug: evento.slug } }" class="btn">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </RouterLink>
          <RouterLink v-if="endedStatus" :to="{ name: 'event-statistics', params: { slug: evento.slug } }" class="btn">
            <i class="fa-solid fa-pen-to-square"></i> Ver estadísticas
          </RouterLink>
        </div>

        <div>
          <div v-if="evento.logo_url" @click="openImage()" class="hero-section" :style="{ backgroundImage: `url(${evento.logo_url})` }" >
            <h1 class="hero-title"> {{ evento.title || "Bienvenidos al Evento" }} </h1>
            <p class="hero-description"> {{ evento.description || "" }} </p>
            <div class="hero-buttons">
              <div v-if="!authStore.authenticated" class="button-group">
                <button v-if="inscriptionStatus" @click="openModal" class="big-btn btn-secondary">
                  Inscribirse al Evento
                </button>
                <RouterLink :to="{ name: 'login' }" class="big-btn btn-primary">
                  Acceder
                </RouterLink>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="text-center hero-section">
              <h1 class="hero-title">{{ evento.title || "Bienvenidos al Evento" }}</h1>
              <p class="hero-description">{{ evento.description || "" }}</p>
              
              <div class="hero-buttons">
                <div v-if="!authStore.authenticated" class="button-group">
                  <button v-if="inscriptionStatus" @click="openModal" class="big-btn btn-secondary">
                    Inscribirse al Evento
                  </button>
                  <RouterLink :to="{ name: 'login' }" class="big-btn btn-primary">
                    Acceder
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

          <!-- Información del Evento -->
          <div id="informacion" class="py-12 bg-white text-center">
            <h2 class="event-title">Información del Evento</h2>
            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto">
              <div v-for="(field, key) in fields" :key="key" class="event-card ">
                <h3 class="event-subtitle">{{ field.label }}</h3>
                <p class="event-text">
                  {{
                    field.type === "date" ? formatDate(evento[key])
                      : field.type === "time" ? formatTime(evento[key])
                        : field.type === "datetime-local" ? formatDateTime(evento[key])
                          : evento[key] || "No disponible"
                  }}
                </p>
              </div>
              <div v-if="isResponsible" v-for="(field, key) in responsibleOnlyFields" :key="key" class="event-card">
                <h3 class="event-subtitle">{{ field.label }}</h3>
                <p class="event-text">
                  {{
                    field.type === "date" ? formatDate(evento[key])
                      : field.type === "time" ? formatTime(evento[key])
                        : field.type === "datetime-local" ? formatDateTime(evento[key])
                          : evento[key] || 'No disponible'
                  }}
                </p>
              </div>
            </div>

          <div v-if="isAuthenticated && (isRegistered || isResponsible) && evento.files" class="mt-6 bg-white p-4 rounded-lg shadow-lg event-container">
            <h3 class="event-subtitle">Documentos</h3>
            <ul>
              <div class="mt-4 grid grid-cols-2 gap-4">
                <div v-for="file in evento.files" :key="file.id" class="file-card">
                  <p class="file-text">{{ file.original_name }}</p>
                  <button>
                    <a :href="file.url" :download="file.name" target="_blank" class="btn-download">
                      Descargar
                    </a>
                  </button>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>

      </template>
    </LayoutPage>
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-10 rounded-lg shadow-lg w-[600px] h-[300px] flex flex-col relative">
        <h2 class="text-2xl font-bold text-center">¿Ya tenés una cuenta de Rondas UNS?</h2>

      <div class="flex flex-col items-center space-y-4 mt-6 flex-grow">
        <RouterLink :to="{ name: 'login' }" class="btn text-xl">
          <i class="fa-solid fa-right-to-bracket"></i>
          Si, iniciar sesión
        </RouterLink>
        <RouterLink :to="{ name: 'register' }" class="btn text-xl">
          <i class="fa-solid fa-user-edit"></i>
          No, crear cuenta
        </RouterLink>
      </div>

      <div class="absolute bottom-2 right-4">
        <button @click="closeModal" class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  </div>
  <ImageModal v-if="evento && evento.logo_url" :imageUrl="evento.logo_url" :visible="showImage"
    @update:visible="showImage = $event" />
</template>


<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";
import ImageModal from "@/components/ImageModal.vue";
import Loading from "@/components/Loading.vue";

const eventStore = useEventStore();
const { evento, loading, error, info, success } = storeToRefs(eventStore);
const route = useRoute();
const showModal = ref(false);
const authStore = useAuthStore();
const { auth_info } = storeToRefs(authStore);

const showImage = ref(false);

const fields = {
  date: { label: "Fecha", type: "date" },
  starts_at: { label: "Horario de inicio", type: "time" },
  ends_at: { label: "Horario de fin", type: "time" },
  inscription_end_date: { label: "Inscripción hasta", type: "datetime-local" },
  location: { label: "Ubicación", type: "text" }
};

const responsibleOnlyFields = {
  meeting_duration: { label: "Duración de reuniones (en minutos)", type: "number" },
  time_between_meetings: { label: "Tiempo entre reuniones (en minutos)", type: "number" },
  matching_end_date: { label: "Matching hasta", type: "datetime-local" },
  max_participants: { label: "Cantidad máxima de participantes", type: "number" },
  meetings_per_user: { label: "Cantidad de reuniones por participante", type: "number" },
}

const isAuthenticated = computed(() => authStore.authenticated);
const isRegistered = computed(() => authStore.registered);
const isResponsible = computed(() => authStore.responsible);

const inscriptionStatus = ref(true);
const endedStatus = ref(true);

onMounted(async () => {
  await eventStore.fetch(route.params.slug);

  if (evento.value) {
    inscriptionStatus.value = evento.value.status === "Inscripcion";
    endedStatus.value = evento.value.status === "Terminado";
  }
});

const openImage = () => {
    showImage.value = true;
  };

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const formatDate = (date) => {
  if (!date) return "No disponible";

  const [year, month, day] = date.split('-');

  return `${day}-${month}-${year}`;
};

const formatDateTime = (datetime) => {
  if (!datetime) return "No disponible";

  const [date, time] = datetime.split(' ');
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  return `${formattedDate} ${formattedTime}`;
};

const formatTime = (time) => {
  if (!time) return "No disponible";
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
};
</script>
