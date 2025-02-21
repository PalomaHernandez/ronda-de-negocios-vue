<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Título y logo -->
      <div class="text-center">
        <img v-if="event.logo_url" :src="event.logo_url" alt="Event Logo" class="mx-auto h-32 w-32 object-cover rounded-full mb-4" />
        <h1 class="text-4xl font-extrabold text-gray-900">{{ event.title }}</h1>
        <p class="mt-2 text-lg text-gray-600">{{ event.description || 'La descripción no está disponible.' }}</p>
      </div>

      <!-- Información del Evento -->
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Fecha del Evento</h3>
          <p class="text-gray-600">{{ new Date(event.date).toLocaleDateString() }}</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Horario</h3>
          <p class="text-gray-600">{{ formatTime(event.starts_at) }} - {{ formatTime(event.ends_at) }}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Duración de reunión</h3>
          <p class="text-gray-600">{{ event.meeting_duration }} min</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Tiempo entre reuniones</h3>
          <p class="text-gray-600">{{ event.time_between_meetings }} min</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Inscripción hasta</h3>
          <p class="text-gray-600">{{ formatTimestamp(event.inscription_end_date) }}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Matching hasta</h3>
          <p class="text-gray-600">{{ formatTimestamp(event.matching_end_date) }}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Estado</h3>
          <p class="text-gray-600">{{ event.status }}</p>
        </div>
      </div>

      <!-- Acción de Participación -->
      <div class="mt-12 text-center">
        <button
          class="inline-block bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Inscribirse al Evento
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: {
        title: 'Congreso Internacional de Innovación',
        description: 'Un evento para discutir las últimas innovaciones tecnológicas.',
        logo_url: 'https://example.com/logo.png', // Path to your logo
        date: '2025-06-15',
        starts_at: '09:00',
        ends_at: '17:00',
        meeting_duration: '00:30', // 30 minutes
        time_between_meetings: '00:15', // 15 minutes between meetings
        inscription_end_date: '2025-06-10T23:59:59',
        matching_end_date: '2025-06-12T23:59:59',
        status: 'Registration',
      },
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
  },
};
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
