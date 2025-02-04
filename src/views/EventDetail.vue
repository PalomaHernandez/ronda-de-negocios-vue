<template>
  <LayoutPage>
    <template #default>
      <p v-if="loading">Cargando...</p>
      <div v-else-if="evento">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900">{{ evento.title }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ evento.description || 'La descripción no está disponible.' }}</p>
        </div>

        <!-- Información del Evento -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Fecha del Evento</h3>
            <p class="text-gray-600">{{ new Date(evento.date).toLocaleDateString() || "No disponible" }}</p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Horario</h3>
            <p class="text-gray-600">
              {{ formatTime(evento.starts_at) }} - {{ formatTime(evento.ends_at) }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Duración de las reuniones</h3>
            <p class="text-gray-600">{{ evento.meeting_duration || "No disponible" }} </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Tiempo entre reuniones</h3>
            <p class="text-gray-600">{{ evento.time_between_meetings || "No disponible" }} min</p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Inscripción hasta</h3>
            <p class="text-gray-600">{{ evento.inscription_end_date || "No disponible" }}</p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Matching hasta</h3>
            <p class="text-gray-600">{{ evento.matching_end_date || "No disponible" }}</p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Estado</h3>
            <p class="text-gray-600">{{ evento.status || "No disponible" }}</p>
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Ubicacion</h3>
            <p class="text-gray-600">{{ evento.location || "No disponible" }}</p>
          </div>

          <div v-if="authStore.authenticated" class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Imagenes</h3>
            <p class="text-gray-600">{{ "aca esto nos falta"}}</p>
          </div>

        </div>

        <div v-if="!authStore.authenticated" class="mt-8 flex justify-end space-x-4">
          <button @click="abrirModal"
            class="bg-yellow-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-yellow-700 focus:outline-none">
            Inscribirse al Evento
          </button>
          <button @click="irALogin"
            class="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none">
            Acceder
          </button>
        </div>
      </div>
      <p v-else-if="error" class="text-red-500 text-center">{{ error }}</p>

      <!-- Modal -->
      <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-10 rounded-lg shadow-lg w-[600px] h-[300px] flex flex-col relative">
          <h2 class="text-2xl font-bold text-center">¿Ya tenés una cuenta de Rondas UNS?</h2>

          <div class="flex flex-col items-center space-y-4 mt-6 flex-grow">
            <button @click="irALogin" class="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 w-2/3">
              Sí, iniciar sesión
            </button>
            <button @click="irARegister"
              class="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 w-2/3">
              No, crear cuenta
            </button>
          </div>

          <div class="absolute bottom-2 right-4">
            <button @click="cerrarModal" class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </template>
  </LayoutPage>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute, useRouter } from "vue-router";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error } = storeToRefs(eventStore);
const route = useRoute();
const router = useRouter();
const mostrarModal = ref(false);
const authStore = useAuthStore();

// Cargar evento al montar
onMounted(() => {
  eventStore.fetch(route.params.name);
});

// Métodos
const abrirModal = () => {
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const irALogin = () => {
  cerrarModal();
  router.push({ name: "login" });
};

const irARegister = () => {
  cerrarModal();
  router.push({ name: "register" });
};

const formatTime = (time) => {
  if (!time) return "No disponible";
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
</script>
