<template>
  <LayoutPage>
    <template #default>
      <Loading v-if="loading" />
      <div v-else-if="evento">
        <div v-if="success" class="alert alert-success" @click="eventStore.clearMessages()">{{ success }}</div>
        <div v-if="error" class="alert alert-danger" @click="eventStore.clearMessages()">{{ error }}</div>
        <div v-if="info" class="alert alert-info" @click="eventStore.clearMessages()">{{ info }}</div>
        
        <div v-if="isResponsible" class="mb-8 flex justify-end space-x-4">
          <RouterLink :to="{ name: 'event-edit', params: { slug: evento.slug } }" class="btn">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </RouterLink>
          <RouterLink :to="{ name: 'event-statistics', params: { slug: evento.slug } }" class="btn">
            <i class="fa-solid fa-pen-to-square"></i> Ver estadísticas
          </RouterLink>
        </div>

        <div class="text-center flex flex-col items-center space-y-5">
          <!-- Título del evento -->
          <div class="flex flex-col items-center">
            <h1 class="text-4xl font-extrabold text-gray-900">{{ evento.title }}</h1>
          </div>

          <!-- Descripción debajo del título -->
          <p class="text-lg text-gray-600">{{ evento.description || 'La descripción no está disponible.' }}</p>

          <!-- Imagen clickeable -->
          <div class="cursor-pointer" @click="openImage">
            <img v-if="evento.logo_path" :src="evento.logo_path" alt="Event Logo"
              class="h-64 w-full object-cover rounded-xl mb-4 cursor-pointer transition transform hover:scale-105" />
          </div>
        </div>

        <!-- Información del Evento -->
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(field, key) in fields" :key="key" class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">{{ field.label }}</h3>
            <p class="text-gray-600">
              {{
                field.type === "date" ? formatDate(evento[key])
                  : field.type === "time" ? formatTime(evento[key])
                    : field.type === "datetime-local" ? formatDateTime(evento[key])
                    : evento[key] || 'No disponible'
              }}
            </p>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="isResponsible" v-for="(field, key) in responsibleOnlyFields" :key="key"
            class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">{{ field.label }}</h3>
            <p class="text-gray-600">
              {{
                field.type === "date" ? formatDate(evento[key])
                  : field.type === "time" ? formatTime(evento[key])
                   : field.type === "datetime-local" ? formatDateTime(evento[key])
                    : evento[key] || 'No disponible'
              }}
            </p>
          </div>
        </div>

        <div v-if="isAuthenticated && (isRegistered || isResponsible)" class="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800">Documentos</h3>
          <ul>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div v-for="file in evento.files" :key="file.id"
                class="border rounded-lg p-3 text-center transition transform hover:scale-105">
                <p class="text-sm text-gray-600 mb-3">{{ file.original_name }}</p>
                <button>
                  <a :href="file.path" download class="btn text-sm">
                    Descargar
                  </a>
                </button>
              </div>
            </div>
          </ul>
        </div>

        <div class="mt-5 flex justify-center">
          <div v-if="!authStore.authenticated" class="space-x-4 flex items-stretch">
            <button v-if="inscriptionStatus" @click="abrirModal"
              class="bg-sky-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-sky-600 focus:outline-none">
              Inscribirse al Evento
            </button>
            <RouterLink :to="{ name: 'login' }"
              class="bg-sky-700 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-sky-800 focus:outline-none">
              Acceder
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </LayoutPage>
  <!-- Modal -->
  <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
        <button @click="cerrarModal" class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  </div>
  <ImageModal v-if="evento && evento.logo_path" :imageUrl="evento.logo_path" :visible="showImage"
          @update:visible="showImage = $event" />
</template>


<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute, useRouter } from "vue-router";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";
import ImageModal from "@/components/ImageModal.vue";
import Loading from "@/components/Loading.vue";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error, info, success } = storeToRefs(eventStore);
const route = useRoute();
const mostrarModal = ref(false);
const authStore = useAuthStore();

const showImage = ref(false);

const openImage = () => {
  showImage.value = true;
};

const fields = {
  date: { label: "Fecha del Evento", type: "date" },
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

onMounted(async () => {
  await eventStore.fetch(route.params.slug);
  
  if (evento.value) {
    inscriptionStatus.value = evento.value.status === "Inscripcion";
  }
});

// Métodos
const abrirModal = () => {
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
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
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false  });
};
</script>
