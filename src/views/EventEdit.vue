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
          <input type="text" class="text-4xl font-extrabold text-gray-900" id="name" name="title"
            v-model="evento.title">
          <input type="text" id="description" name="description" v-model="evento.description">
        </div>

        <!-- Información del Evento -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Fecha del Evento</h3>
            <input type="date" id="date" name="date" v-model="evento.date">
          </div>

          <div class="row bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Horario</h3>
            <input type="time" id="starts_at" name="starts_at" v-model="evento.starts_at">
            <p class="text-gray-600"> - </p>
            <input type="time" id="ends_at" name="ends_at" v-model="evento.ends_at">
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Duración de las reuniones</h3>
            <input type="text" id="meeting_duration" name="meeting_duration" v-model="evento.meeting_duration">
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Tiempo entre reuniones</h3>
            <input type="text" id="time_between_meetings" name="time_between_meetings"
              v-model="evento.time_between_meetings">
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Inscripción hasta</h3>
            <input type="date" id="inscription_end_date" name="inscription_end_date"
              v-model="evento.inscription_end_date">
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Matching hasta</h3>
            <input type="date" id="matching_end_date" name="matching_end_date" v-model="evento.matching_end_date">
          </div>

          <div class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Estado</h3>
            <p class="text-gray-600">{{ evento.status || "No disponible" }}</p>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <button @click="update"
            class="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none">
            Guardar cambios
          </button>
        </div>
      </div>
      <p v-else-if="error" class="text-red-500 text-center">{{ error }}</p>


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
    }
  },
  setup() {
    const eventStore = useEventStore();
    //const { evento } = storeToRefs(eventStore);
    // Obtener parámetros de la ruta
    const route = useRoute();
    const eventName = route.params.name;
    const router = useRouter();
    onMounted(() => {
      eventStore.fetch(eventName);
    });
    return {
      eventStore,
      router,
      //evento,
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
    update() {
      if (!this.evento.title ) {
        alert("El título es obligatorio.");
        return;
      }
      this.eventStore.update()
    }
  },
};
</script>