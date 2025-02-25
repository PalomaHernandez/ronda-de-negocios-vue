<template>
  <LayoutPage>
    <template #default>
      <Loading v-if="loading" />

      <div v-else-if="evento" class="flex flex-col md:flex-row space-x-6">
        <!-- 📌 Columna izquierda con información del evento -->
        <div class="w-full md:w-1/3 bg-white shadow-lg p-6 rounded-lg mb-6 md:mb-0">
          <h2 class="text-xl font-bold text-gray-900">{{ evento.title }}</h2>
          <p class="text-gray-600"><strong>Ubicación:</strong> {{ evento.location }}</p>
          <p class="text-gray-600"><strong>Fecha:</strong> {{ evento.date }}</p>
          <p class="text-gray-600"><strong>Fase actual:</strong> {{ evento.status }}</p>

          <!-- Botón "Mis reuniones e invitaciones" -->
          <RouterLink :to="{ name: 'event-invitations'}"
            class="w-full flex justify-center bg-sky-700 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-sky-800 mt-4">
            Mis reuniones e invitaciones
          </RouterLink>

          <!-- 📌 Remaining meetings del usuario actual -->
          <p class="text-gray-600 mt-4">
            <strong>Cantidad de solicitudes restantes:</strong> {{ userRemainingMeetings ?? 'No disponible' }}
          </p>
        </div>

        <!-- 📌 Contenedor de participantes y filtros -->
        <div class="w-full md:w-2/3">
          <h2 class="text-2xl font-semibold mb-2">Participantes</h2>

          <!-- 🔎 Barra de búsqueda y filtro -->
          <div class="flex space-x-2 mb-2">
            <input type="text" v-model="searchQuery" placeholder="Buscar por nombre..."
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <!-- 🏷️ Filtro desplegable -->
            <select v-model="filterType"
              class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos</option>
              <option value="offers">Oferentes</option>
              <option value="seeks">Demandantes</option>
            </select>
          </div>

          <!-- 📌 Lista de participantes (scrolleable) -->
          <div class="border rounded-lg shadow p-4 mt-2 flex-grow h-[60vh] overflow-y-auto bg-white">

            <ul v-if="filteredParticipants.length > 0">
              <li v-for="participant in filteredParticipants" :key="participant.id" class="p-3 border-b">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full mr-3 object-cover">
                      <img v-if="participant.logo_url" :src="participant.logo_url" alt="Logo"/>
                      <i v-else class="fa-solid fa-circle-user text-gray-400 text-4xl"></i>
                    </div>
                    <div>
                      <p class="text-lg font-medium">{{ participant.name }}</p>
                      <p v-if="participant.activity" class="text-sm text-gray-500">{{ participant.activity }}</p>
                      <p v-if="participant.interests && filterType !== 'offers'" class="text-lg font-medium">{{ 'Busca ' + (participant.interests || '') }}</p>
                      <p v-if="participant.product_services && filterType !== 'seeks'" class="text-lg font-medium">{{ 'Ofrece ' + (participant.product_services || '') }}</p>
                    </div>
                  </div>
                  <div class="space-x-2 flex flex-col md:flex-row">
                    <button @click="openDetailsModal(participant)"
                      class="bg-sky-700 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-sky-800 mb-2 md:mb-0">
                      Más detalles
                    </button>
                    <button v-if="evento?.status == 'Matcheo' && userRemainingMeetings>0"
                      @click="openMeetingRequest(participant)" 
                      class="bg-sky-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 mb-2 md:mb-0">
                      Solicitar reunión
                    </button>
                    <button v-if="evento?.status == 'Matcheo' && userRemainingMeetings<1"  
                      class="bg-sky-600 text-white text-lg font-semibold py-2 px-4 rounded-lg opacity-60 cursor-not-allowed mb-2 md:mb-0"
                      title="Ha agotado todas sus solicitudes">
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
    </template>
  </LayoutPage>

  <ParticipantDetailsModal :show="showDetailsModal" :participant="selectedParticipantDetails"
    @close="showDetailsModal = false" />
  <MeetingRequestModal :showModal="showModal" 
    :selectedParticipant="selectedParticipant" 
    :userId="authStore.user.id" 
    :eventId="evento.id" 
    @close="closeMeetingRequest" 
    @submit="submitMeetingRequest" />
</template>


<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useAuthStore } from "@/stores/auth"; // Importamos la store de autenticación
import { useRouter, useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import Loading from "@/components/Loading.vue";
import MeetingRequestModal from "@/components/MeetingRequestModal.vue";
import ParticipantDetailsModal from "@/components/ParticipantDetailsModal.vue";

// Estado y store
const eventStore = useEventStore();
const authStore = useAuthStore(); // Store del usuario actual
const { evento, participants, loading, error, meetings } = storeToRefs(eventStore);
const route = useRoute();
const router = useRouter();

// Estado de la barra de búsqueda y filtro
const searchQuery = ref("");
const filterType = ref("all"); // "all", "offers", "seeks"

// 🔍 Computed para filtrar participantes según búsqueda y filtro
const filteredParticipants = computed(() => {
  if(participants.value){
    return participants.value
      .filter(participant => participant.id !== authStore.user.id)
      .filter(participant => 
    !sentRequests.value.includes(participant.id) &&
    !meetings.value.some(meeting =>
      (meeting.requester_id === authStore.user.id && meeting.receiver_id === participant.id) ||
      (meeting.receiver_id === authStore.user.id && meeting.requester_id === participant.id)
    )
  )
    .filter(participant =>
      participant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .filter(participant => {
      if (filterType.value === "offers") {
        return participant.product_services;
      } else if (filterType.value === "seeks") {
        return participant.interests;
      } 
      return true;
    });
  }
});

const userRemainingMeetings = computed(() => {
  const userParticipant = participants.value.find(
    (participant) => participant.id === authStore.user.id
  );
  return userParticipant ? userParticipant.remaining_meetings : null;
});

// Cargar datos al montar
onMounted(async () => {
  await eventStore.fetch(route.params.slug); // Obtener evento
  if (evento.value?.status === "Inscripcion") {
    router.push({ name: "event-detail", params: { slug: route.params.slug } });
    return; // Detener la ejecución
  }
  if(evento.value) {
    await eventStore.fetchParticipants(evento.value.id); // Obtener participantes
    await eventStore.fetchUserMeetings(evento.value.id, authStore.user.id); // Obtener reuniones del usuario
  }
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
const submitMeetingRequest = async (meetingData) => {
  if (!meetingData) {
    console.error('Faltan campos');
    return;
  }

  try {
    // Enviar la solicitud al backend
    await eventStore.createMeeting(meetingData);
    
    // Añadir el ID del participante a la lista de solicitudes enviadas
    sentRequests.value.push(selectedParticipant.value.id);

    // Cerrar el modal después de enviar la solicitud
    closeMeetingRequest();
  } catch (error) {
    console.error('Error al enviar la solicitud de reunión:', error);
  }
}
</script>
