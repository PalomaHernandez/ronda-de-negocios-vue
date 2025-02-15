<template>
  <LayoutPage>
    <template #default>
      <Loading v-if="loading" />

      <div v-else-if="evento" class="flex flex-col space-y-10">
        <!-- 📌 Columna izquierda con información del evento -->
        <div class="w-full flex-grow">
          <h2 class="text-2xl font-semibold">Reuniones</h2>

          <div class="flex space-x-2 mb-2">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar por nombre..."
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              v-model="filterType"
              class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
                    <button 
                      @click="openMeetingDetails(meeting)" 
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
                    <div v-else-if="meeting.status === 'Pendiente' && meeting.receiver_id !== authStore.user.id" class="flex items-center space-x-2">
                      <span class="text-yellow-500 font-semibold">Esperando respuesta...</span>
                      <button 
                        @click="cancelMeeting(meeting)" 
                        class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
                        Cancelar
                      </button>
                    </div>
                    <div v-else class="flex items-center space-x-2">  
                      <button 
                        @click="acceptMeeting(meeting)" 
                        class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                        Aceptar reunión
                      </button>
                      <button 
                        @click="rejectMeeting(meeting)" 
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
          <button @click="backToMeetings"
            class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Volver
          </button>
          <button 
            class="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">
            Descargar Cronograma
          </button>
        </div>
      </div>
<!-- 📌 MODAL: Detalles de la Reunión -->
<div v-if="showMeetingDetailsModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
    <h2 class="text-2xl font-bold mb-4 text-center">Detalles de la Reunión</h2>

    <div v-if="selectedMeeting" class="grid grid-cols-3 gap-4 items-center">
      <!-- 📌 Columna 1: Participantes -->
      <div class="flex flex-col items-center">
        <p class="text-sm text-gray-500">Solicitante</p>
        <p class="text-lg font-semibold text-center">
          {{ selectedMeeting.requesterName }}
        </p>
        <button          
          class="bg-yellow-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700">
          Más detalles
        </button>
      </div>

      <!-- 📌 Columna 2: Espacio vacío para alineación -->
      <div class="flex flex-col items-center"></div>

      <!-- 📌 Columna 3: Receptor -->
      <div class="flex flex-col items-center">
        <p class="text-sm text-gray-500">Receptor</p>
        <p class="text-lg font-semibold text-center">
          {{ selectedMeeting.receiverName }}
        </p>
        <button          
          class="bg-yellow-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700">
          Más detalles
        </button>
      </div>
    </div>

    <!-- 📌 Sección de información adicional -->
    <div class="grid grid-cols-3 gap-4 mt-6">
      <div class="flex flex-col items-center">
        <p class="text-sm text-gray-500">Rol</p>
        <p class="text-lg font-semibold">{{ formatRole(selectedMeeting.requester_role) }}</p>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-sm text-gray-500">Estado</p>
        <p class="text-lg font-semibold">{{ selectedMeeting.status }}</p>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-sm text-gray-500">Rol</p>
        <p class="text-lg font-semibold">{{ formatRole(getReceiverRole(selectedMeeting.requester_role)) }}</p>
      </div>
    </div>

    <!-- 📌 Motivo con salto de línea -->
    <p class="mt-6 px-4 text-justify break-words">
      <strong>Motivo:</strong> {{ selectedMeeting.reason || 'No especificado' }}
    </p>

    <!-- 📌 Botón de cierre abajo a la derecha -->
    <div class="flex justify-end mt-6">
      <button @click="closeMeetingDetails"
        class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
        Cerrar
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
              <p class="text-gray-700"> <strong> Ubicación:</strong> {{ selectedParticipantDetails.location || 'No disponible' }}</p>
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
                class="w-24 h-24 object-cover rounded-lg shadow cursor-pointer transition transform hover:scale-105"
                @click="openImageModal(image.path)" />
            </div>
          </div>

          <ImageModal :imageUrl="selectedImage" :visible="showImageModal" @update:visible="showImageModal = $event" />

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
import Loading from "@/components/Loading.vue";

// Estado y store
const eventStore = useEventStore();
const authStore = useAuthStore(); // Store del usuario actual
const { evento, meetings , loading, error, participants} = storeToRefs(eventStore);
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

  watchEffect(() => {
    if (evento.value) {
      eventStore.fetchParticipants(evento.value.id);
    }
  });
  if (evento.value) {
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
const formatRole = (role) => {
  if (role === "Compra") return "Comprador";
  if (role === "Venta") return "Vendedor";
  if (role === "Ambos") return "Comprador y Vendedor";
  return role; // Si hay otros valores, los deja igual
};

const getReceiverRole = (requesterRole) => {
  if (requesterRole === "Compra") return "Venta";
  if (requesterRole === "Venta") return "Compra";
  if (requesterRole === "Ambos") return "Ambos";
  return requesterRole; // Por si hay valores inesperados
};


</script>
