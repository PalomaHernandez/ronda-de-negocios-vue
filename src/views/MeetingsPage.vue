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
          <RouterLink :to="{ name: 'event-invitations' }"
            class="w-full flex justify-center bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 mt-4">
            Mis reuniones e invitaciones
          </RouterLink>

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
            <input type="text" v-model="searchQuery" placeholder="Buscar por nombre..."
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <!-- 🏷️ Filtro desplegable -->
            <select v-model="filterType"
              class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                    <img v-if="participant.logo_path" :src="participant.logo_path" alt="Logo"
                      class="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                      <p class="text-lg font-medium">{{ participant.name }}</p>
                      <p class="text-sm text-gray-500">{{ participant.activity }}</p>
                      <p class="text-lg font-medium">{{ 'Busca ' + (participant.interests || 'Nada') }}</p>
                      <p class="text-lg font-medium">{{ 'Ofrece ' + (participant.product_services || 'Nada') }}</p>
                    </div>
                  </div>
                  <div class="space-x-2">
                    <button @click="openDetailsModal(participant)"
                      class="bg-yellow-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700">
                      Más detalles
                    </button>
                    <button @click="openMeetingRequest(participant)"
                      class="bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-green-700">
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
      <!-- 📌 MODAL: Solicitud de reunión -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 class="text-xl font-bold mb-4">Solicitud de reunión</h2>

          <!-- Objetivo de la reunión -->
          <label class="block text-gray-700">Objetivo:</label>
          <select v-model="meetingObjective" class="w-full p-2 border rounded-lg mb-4">
            <option value="Compra">Busco tus servicios</option>
            <option value="Venta">Ofrezco mis servicios</option>
            <option value="Ambos">Busco tus servicios y oferto los míos</option>
          </select>

          <!-- Motivo -->
          <label class="block text-gray-700">Motivo:</label>
          <textarea v-model="meetingReason" rows="3" class="w-full p-2 border rounded-lg mb-4"
            placeholder="Escribe el motivo de la reunión..."></textarea>

          <!-- Botones -->
          <div class="flex justify-end space-x-2">
            <button @click="closeMeetingRequest" class="bg-gray-400 text-white py-2 px-4 rounded-lg">
              Cancelar
            </button>
            <button @click="submitMeetingRequest" class="bg-blue-600 text-white py-2 px-4 rounded-lg">
              Enviar solicitud
            </button>
          </div>
        </div>
      </div>

      <div v-if="showDetailsModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <!-- Foto de perfil centrada -->
          <div class="flex flex-col items-center">
            <img v-if="selectedParticipantDetails.logo_path" :src="selectedParticipantDetails.logo_path" alt="Logo"
              class="w-24 h-24 rounded-full object-cover shadow-md" />
            <h2 class="text-2xl font-bold text-gray-900 mt-3">{{ selectedParticipantDetails.name }}</h2>
            <p class="text-gray-500 text-lg">{{ selectedParticipantDetails.activity || 'No disponible' }}</p>
          </div>

          <!-- Información en tarjetas -->
          <div class="mt-4 space-y-3">
            <div class="flex items-center bg-gray-100 p-3 rounded-lg">
              <i class="fa-solid fa-location-dot mr-2"></i>
              <p class="text-gray-700">  <strong> Ubicación:</strong> {{ selectedParticipantDetails.location || 'No disponible' }}</p>
            </div>

            <div class="flex items-center bg-gray-100 p-3 rounded-lg">
              <i class="fa-solid fa-magnifying-glass mr-2"></i>
              <p class="text-gray-700"><strong>Intereses:</strong> {{ selectedParticipantDetails.interests || 'No disponible' }}</p>
            </div>

            <div class="flex items-center bg-gray-100 p-3 rounded-lg">
              <i class="fa-solid fa-store mr-2"></i>
              <p class="text-gray-700"><strong>Productos o Servicios:</strong> {{
                selectedParticipantDetails.product_services || 'No disponible' }}</p>
            </div>
          </div>

          <!-- Galería de imágenes -->
          <div v-if="selectedParticipantDetails.profile_images?.length" class="mt-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Galería</h3>
            <div class="grid grid-cols-3 gap-2">
              <img v-for="image in selectedParticipantDetails.profile_images" :key="image.id" :src="image.path"
                alt="Gallery image"
                class="w-24 h-24 object-cover rounded-lg shadow cursor-pointer transition transform hover:scale-105" @click="openImageModal(image.path)" />
            </div>
          </div>

          <ImageModal :imageUrl="selectedImage" :visible="showImageModal"
            @update:visible="showImageModal = $event" />

          <!-- Botón de cierre -->
          <div class="flex justify-center mt-5">
            <button @click="closeDetailsModal"
              class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
              Cerrar
            </button>
          </div>
        </div>
      </div>

    </template>
  </LayoutPage>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useAuthStore } from "@/stores/auth"; // Importamos la store de autenticación
import { useRouter, useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import ImageModal from "@/components/ImageModal.vue";

// Estado y store
const eventStore = useEventStore();
const authStore = useAuthStore(); // Store del usuario actual
const { evento, participants, loading, error, meetings } = storeToRefs(eventStore);
const route = useRoute();


// Estado de la barra de búsqueda y filtro
const searchQuery = ref("");
const filterType = ref("all"); // "all", "offers", "seeks", "both"

// 🔍 Computed para filtrar participantes según búsqueda y filtro
const filteredParticipants = computed(() => {
  return participants.value
  .filter(participant => !sentRequests.value.includes(participant.id))
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

const userRemainingMeetings = computed(() => {
  const userParticipant = participants.value.find(
    (participant) => participant.participant_id === authStore.user.participant_id
  );
  console.log(userParticipant);
  return userParticipant ? userParticipant.remaining_meetings : null;
});

// Cargar datos al montar
onMounted(async () => {
  await eventStore.fetch(route.params.slug); // Obtener evento

  // Verificar que se obtuvo el evento antes de pedir participantes
  watchEffect(() => {
    if (evento.value) {
      if(!participants.value.length){
        eventStore.fetchParticipants(evento.value.id);
      }
      const userId = authStore.user.id;
      eventStore.fetchUserMeetings(evento.value.id, userId);
    }
  });
});

// Estado del modal
const showModal = ref(false);
const meetingObjective = ref("");
const meetingReason = ref("");
const selectedParticipant = ref(null);

// Abrir modal
const openMeetingRequest = (participant) => {
  selectedParticipant.value = participant;
  showModal.value = true;
};

// Cerrar modal
const closeMeetingRequest = () => {
  showModal.value = false;
  meetingObjective.value = "";
  meetingReason.value = "";
};

const showDetailsModal = ref(false);
const selectedParticipantDetails = ref(null);

// Abrir modal de detalles
const openDetailsModal = (participant) => {
  selectedParticipantDetails.value = participant;
  showDetailsModal.value = true;
};

// Cerrar modal de detalles
const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedParticipantDetails.value = null;
};

const showImageModal = ref(false);
const selectedImage = ref("");

const openImageModal = (selected) => {
  showImageModal.value = true;
  selectedImage.value = selected;
};

const sentRequests = computed(() => {
  return meetings.value
    .map(meeting => meeting.receiver_id); // Guardamos los IDs de los destinatarios
});;

// Enviar solicitud (falta lógica de backend)
const submitMeetingRequest = async () => {
  if (!selectedParticipant.value || !meetingObjective.value || !meetingReason.value) {
    console.error('Faltan campos');
    return;
  }

  // Crear el objeto con los datos necesarios
  const meetingData = {
    requester_id: authStore.user.id, // ID del usuario autenticado
    receiver_id: selectedParticipant.value.id, // ID del participante seleccionado
    event_id: eventStore.evento.id, // ID del evento
    reason: meetingReason.value, // Motivo de la reunión
    time: '2025-02-09 14:30:00',  // Hora fija para el ejemplo, o puedes agregar un selector de hora en tu formulario
    status: 'Pendiente', // Estado de la solicitud (puedes cambiarlo según tu lógica)
    requester_role: meetingObjective.value, // Objetivo de la reunión
  };
  try {
    await eventStore.createMeeting(meetingData);

    sentRequests.value.push(selectedParticipant.value.id);

    closeMeetingRequest();
  } catch (error) {
    console.error('Error al enviar la solicitud de reunión:', error);
  }
}
</script>
