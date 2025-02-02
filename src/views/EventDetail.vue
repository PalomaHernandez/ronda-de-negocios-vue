<template>
  <div class="bg-blue-500 min-h-screen flex items-center justify-center">
    <!-- Contenedor principal del rectángulo -->
    <div
      class="absolute top-2 left-2 bg-yellow-300 px-4 py-2 rounded-tr-lg rounded-bl-lg text-sm font-bold text-gray-800">
      Rondas UNS
    </div>
    <!-- Contenedor blanco (ajustado para ocupar más espacio) -->
    <div
      class="bg-white rounded-lg shadow-lg w-full  sm:w-full md:w-full xl:max-w-full p-6 sm:p-8 md:p-10 relative m-10 ">
      <!-- Encabezado "Rondas UNS" -->

      <!-- Contenido original de la página -->
      <p v-if="loading">Cargando...</p>
      <div v-else-if="evento">

        <div class="text-center">
          <!--img v-if="event.logo_path" :src="event.logo_path" alt="Event Logo" class="mx-auto h-32 w-32 object-cover rounded-full mb-4" /-->
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
              {{ formatTime(evento.starts_at) }} - {{ formatTime(evento.starts_at) }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Duración de reunión</h3>
            <p class="text-gray-600">{{ evento.meeting_duration || "No disponible" }} </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Tiempo entre reuniones</h3>
            <p class="text-gray-600">{{ evento.time_between_meetings || "No disponible" }} </p>
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
        </div>

        <div class="mt-8 flex justify-end space-x-4">
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

          <!-- Título -->
          <h2 class="text-2xl font-bold text-center">¿Ya tenés una cuenta de Rondas UNS?</h2>

          <!-- Botones centrados -->
          <div class="flex flex-col items-center space-y-4 mt-6 flex-grow">
            <button @click="irALogin" class="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 w-2/3">
              Sí, iniciar sesión
            </button>
            <button @click="irARegister"
              class="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 w-2/3">
              No, crear cuenta
            </button>
          </div>

          <!-- Botón "Cancelar" en la esquina inferior derecha -->
          <div class="absolute bottom-2 right-4">
            <button @click="cerrarModal" class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
              Cancelar
            </button>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script lang="js">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "EventDetail",
  computed: {
    loading() {
      return this.eventStore.loading
    },
    evento() {
      return this.eventStore.evento
    },
  },
  setup() {
    const eventStore = useEventStore();
    const { evento } = storeToRefs(eventStore);
    // Obtener parámetros de la ruta
    const route = useRoute();
    const eventName = route.params.name;
    const router = useRouter();
    const mostrarModal = ref(false);
    onMounted(() => {
      eventStore.fetchEvento(eventName);
    });
    return {
      eventStore,
      mostrarModal,
      router,
    };
  },
  methods: {
    formatTime(time) {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return 'No disponible';
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    abrirModal() {
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    irALogin() {
      this.cerrarModal();
      this.router.push({ name: "login" });
    },
    irARegister() {
      this.cerrarModal();
      this.router.push({ name: "register" });
    }
  }
};
</script>
