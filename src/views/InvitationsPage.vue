<template>
  <LayoutPage>
    <template #default>
      <Loading v-if="loading" />

      <div v-else-if="evento" class="flex flex-col space-y-10">



        <!-- 📌 Columna izquierda con información del evento -->
        <div class="w-full flex-grow">
          <h2 class="text-2xl font-semibold">Reuniones</h2>

          <div class="flex space-x-2 mb-2">
            <input type="text" v-model="searchQuery" placeholder="Buscar por nombre..."
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <select v-model="filterType"
              class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todas</option>
              <option value="Aceptada">Aceptadas</option>
              <option value="Rechazada">Rechazadas</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Esperando">Esperando</option>
            </select>
          </div>

          <!-- 📌 Lista de reuniones -->
          <div class="border rounded-lg shadow p-4 mt-2 flex-grow h-[50vh] overflow-y-auto bg-white">
            <ul v-if="filteredMeetings.length > 0">
              <li v-for="meeting in filteredMeetings" :key="meeting.id" class="p-3 border-b">
                <div class="flex items-center justify-between">
                  <!-- Nombre del participante -->
                  <div class="flex items-center w-1/3">
                    <p class="text-lg font-medium">
                      {{ getParticipant(meeting)?.name || 'Desconocido' }}
                    </p>
                  </div>

                  <!-- Botón "Más detalles" centrado y alineado a la misma altura -->
                  <div class="flex items-center justify-center w-1/3">
                    <button @click="openMeetingDetails(meeting)"
                      class="bg-yellow-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700">
                      Más detalles
                    </button>
                  </div>

                  <!-- Estado y botones a la derecha -->
                  <div class="flex items-center justify-end w-1/3 space-x-4">
                    <div v-if="meeting.status === 'Aceptada'" class="flex items-center space-x-2">
                      <span class="text-green-500 font-semibold">Aceptada</span>
                    </div>
                    <div v-else-if="meeting.status === 'Rechazada'" class="flex items-center space-x-2">
                      <span class="text-red-500 font-semibold">Rechazada</span>
                    </div>
                    <div v-else-if="meeting.status === 'Pendiente' && meeting.receiver_id !== authStore.user.id"
                      class="flex items-center space-x-2">
                      <span class="text-yellow-500 font-semibold">Esperando respuesta...</span>
                      <button @click="cancelMeeting(meeting)"
                        class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
                        Cancelar
                      </button>
                    </div>
                    <div v-else class="flex items-center space-x-2">
                      <button @click="acceptMeeting(meeting)"
                        class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                        Aceptar reunión
                      </button>
                      <button @click="rejectMeeting(meeting)"
                        class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                        Rechazar reunión
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <p v-else class="text-gray-500">No hay reuniones registradas para este evento.</p>
          </div>
        </div>

        <!-- Contenedor de los botones en la parte inferior derecha -->
        <div class="flex justify-end space-x-4">
          <button @click="backToMeetings" class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Volver
          </button>
          <div v-if="evento?.status == 'Terminado'">
            <!-- Botón activo si NO está en Inscripción -->
            <button 
              @click="downloadSchedule" 
              class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
              Descargar Cronograma
            </button>
          </div>

          <!-- Botón deshabilitado si está en Inscripción -->
          <div 
            v-else 
            class="bg-green-600 text-white py-2 px-4 rounded-lg opacity-60 cursor-not-allowed"
            title="Disponible cuando haya finalizado el periodo de coordinacion de reuniones">
            Descargar Cronograma
          </div>
        </div>
      </div>
      <MeetingDetailsModal :show="showMeetingDetailsModal" :meeting="selectedMeeting"
                    @close="closeMeetingDetails" />

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
import Loading from "@/components/Loading.vue";
import MeetingDetailsModal from "@/components/MeetingDetailsModal.vue";

// Estado y store
const eventStore = useEventStore();
const authStore = useAuthStore(); // Store del usuario actual
const { evento, meetings, loading, error, participants } = storeToRefs(eventStore);
const route = useRoute();
const router = useRouter();
const showMeetingDetailsModal = ref(false);
const selectedMeeting = ref(null);

// Estado de la barra de búsqueda y filtro
const searchQuery = ref("");
const filterType = ref("all");

const filteredMeetings = computed(() => {

  return meetings.value
    .filter(meeting => {
      // Buscamos el participante que corresponde al receiver_id de la reunión
      const participant = getParticipant(meeting);

      // Si encontramos el participante, comparamos su nombre con el searchQuery
      if (participant) {
        return participant.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      }
      return false;
    })
    .filter(meeting => {// Para verificar los valores de los estados
      // Filtrado por el tipo de estado de la reunión (aceptado, rechazado, pendiente, etc.)
      if (filterType.value === "Aceptada") {
        return meeting.status === "Aceptada";  // Filtramos solo las aceptadas
      } else if (filterType.value === "Rechazada") {
        return meeting.status === "Rechazada";  // Filtramos solo las rechazadas
      } else if (filterType.value === "Pendiente") {
        return meeting.status === "Pendiente";  // Filtramos solo las pendientes
      } else if (filterType.value === "Esperando") {
        return meeting.status === "Pendiente" && meeting.receiver_id === authStore.user.id;  // Filtramos las esperando y solo las que son para el usuario actual
      }
      return true;  // "all" -> No filtramos nada
    });

});


// Cargar datos al montar
onMounted(async () => {
  await eventStore.fetch(route.params.slug); // Obtener evento
  
  await eventStore.fetch(route.params.slug); // Obtener evento
  if (evento.value?.status === "Inscripcion") {
    router.push({ name: "event-detail", params: { slug: route.params.slug } });
    return; // Detener la ejecución
  }

  if (evento.value) {
    eventStore.fetchParticipants(evento.value.id);
    const userId = authStore.user.id;
    await eventStore.fetchUserMeetings(evento.value.id, userId); // Cargar reuniones del usuario
  }

});
const participantsMap = computed(() => {
  // Mapeamos los participantes a un objeto donde las claves son los IDs
  const map = {};
  participants.value.forEach(p => {
    map[p.id] = p;
  });
  return map;
});

const cancelMeeting = async (meeting) => {

  try {
    await eventStore.deleteMeeting(meeting.id); // Llamar al método en el store
    await eventStore.fetchUserMeetings(evento.value.id, authStore.user.id); // Recargar la lista de reuniones
  } catch (error) {
    console.error("Error al cancelar la reunión:", error);
  }
};


const acceptMeeting = async (meeting) => {
  await eventStore.acceptMeeting(meeting.id);
};

const rejectMeeting = async (meeting) => {
  await eventStore.rejectMeeting(meeting.id);
};

const getParticipant = (meeting) => {
  // Obtener el otro participante
  const otherParticipantId = meeting.receiver_id === authStore.user.id ? meeting.requester_id : meeting.receiver_id;

  return participantsMap.value[otherParticipantId] || null;
};

const backToMeetings = () => {
  router.push({ name: "event-meetings" });
};

const downloadSchedule = () => {
  eventStore.downloadParticipantSchedule(authStore.user);
}

const openMeetingDetails = (meeting) => {
  const requester = participants.value.find(p => p.id === meeting.requester_id);
  const receiver = participants.value.find(p => p.id === meeting.receiver_id);

  selectedMeeting.value = {
    ...meeting,
    requesterName: requester ? requester.name : "Desconocido",
    receiverName: receiver ? receiver.name : "Desconocido",
  };

  showMeetingDetailsModal.value = true;
};
const closeMeetingDetails = () => {
  showMeetingDetailsModal.value = false;
  selectedMeeting.value = null;
};

</script>
