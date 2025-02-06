<template>
  <LayoutPage>
    <template #default>
      <p v-if="loading">Cargando...</p>

      <div v-else-if="evento" class="flex space-x-6">
        <!-- 📌 Columna izquierda con información del evento -->
        <div class="w-1/3 bg-white shadow-lg p-6 rounded-lg">
          <h2 class="text-xl font-bold text-gray-900">{{ evento.title }}</h2>
          <p class="text-gray-600"><strong>Ubicación:</strong> {{ evento.location }}</p>
          <p class="text-gray-600"><strong>Fecha:</strong> {{ evento.date }}</p>
          <p class="text-gray-600"><strong>Fase actual:</strong> {{ evento.status }}</p>

          <!-- Botón "Mis reuniones e invitaciones" -->
          <button
            class="w-full bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 mt-4"
          >
            Mis reuniones e invitaciones
          </button>

          <!-- 📌 Remaining meetings del usuario actual -->
          <p class="text-gray-600 mt-4">
            <strong>Remaining meetings:</strong> {{ userRemainingMeetings ?? 'No disponible' }}
          </p>
        </div>

        <!-- 📌 Contenedor de participantes y filtros -->
        <div class="w-2/3">
          <h2 class="text-2xl font-semibold">Participantes</h2>

          <!-- 🔎 Barra de búsqueda y filtro -->
          <div class="flex space-x-2 mb-2">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar por nombre..."
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- 🏷️ Filtro desplegable -->
            <select
              v-model="filterType"
              class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="offers">Solo ofrece</option>
              <option value="seeks">Solo busca</option>
              <option value="both">Ofrece y busca</option>
            </select>
          </div>

          <!-- 📌 Lista de participantes (scrolleable) -->
          <div class="border rounded-lg shadow p-4 mt-2 flex-grow h-[60vh] overflow-y-auto bg-white">

            <ul v-if="filteredParticipants.length > 0">
              <li v-for="participant in filteredParticipants" :key="participant.id" class="p-3 border-b">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img
                      v-if="participant.logo_path"
                      :src="participant.logo_path"
                      alt="Logo"
                      class="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <p class="text-lg font-medium">{{ participant.name }}</p>
                      <p class="text-sm text-gray-500">{{ participant.activity }}</p>
                      <p class="text-lg font-medium">{{ 'Busca ' + (participant.interests || 'Nada') }}</p>
                      <p class="text-lg font-medium">{{ 'Ofrece ' + (participant.product_services || 'Nada') }}</p>
                    </div>
                  </div>
                  <div class="space-x-2">
                    <button class="bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                      Más detalles
                    </button>
                    <button class="bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-green-700">
                      Solicitar reunión
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <p v-else class="text-gray-500">No hay participantes registrados o no coinciden con la búsqueda.</p>
          </div>
        </div>
      </div>

      <p v-else-if="error" class="text-red-500 text-center">{{ error }}</p>
    </template>
  </LayoutPage>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useAuthStore } from "@/stores/auth"; // Importamos la store de autenticación
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";

// Estado y store
const eventStore = useEventStore();
const authStore = useAuthStore(); // Store del usuario actual
const { evento, participants, loading, error } = storeToRefs(eventStore);
const route = useRoute();

// Estado de la barra de búsqueda y filtro
const searchQuery = ref("");
const filterType = ref("all"); // "all", "offers", "seeks", "both"

// 🔍 Computed para filtrar participantes según búsqueda y filtro
const filteredParticipants = computed(() => {
  return participants.value
    .filter(participant =>
      participant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .filter(participant => {
      if (filterType.value === "offers") {
        return participant.product_services && !participant.interests;
      } else if (filterType.value === "seeks") {
        return participant.interests && !participant.product_services;
      } else if (filterType.value === "both") {
        return participant.interests && participant.product_services;
      }
      return true; // "all" -> No filtramos nada
    });
});

// ✅ Computed para obtener las remaining meetings del usuario actual
const userRemainingMeetings = computed(() => {
  const userParticipant = participants.value.find(
    (participant) => participant.participant_id === authStore.user.participant_id
  );
  return userParticipant ? userParticipant.remaining_meetings : null;
});

// Cargar datos al montar
onMounted(async () => {
  await eventStore.fetch(route.params.name); // Obtener evento

  // Verificar que se obtuvo el evento antes de pedir participantes
  watchEffect(() => {
    if (evento.value) {
      eventStore.fetchParticipants(evento.value.id);
    }
  });
});
</script>
