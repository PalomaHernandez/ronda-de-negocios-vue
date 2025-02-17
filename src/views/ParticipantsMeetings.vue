<template>
    <LayoutPage>
        <template #default>
            <Loading v-if="loading" />

            <div v-if="success" class="alert alert-success" @click="eventStore.clearMessages()">{{ success }}</div>
            <div v-if="error" class="alert alert-danger" @click="eventStore.clearMessages()">{{ error }}</div>
            <div v-if="info" class="alert alert-info" @click="eventStore.clearMessages()">{{ info }}</div>

            <div v-else-if="evento" class="flex flex-col space-y-6 p-4 md:p-6">
                <!-- 📌 Columna izquierda con información del evento -->
                <div class="w-full flex-grow">
                    <h2 class="text-2xl font-semibold">Reuniones</h2>

                    <div class="flex flex-col md:flex-row md:space-x-2 mb-4 space-y-2 md:space-y-0">
                        <input type="text" v-model="searchQuery" placeholder="Buscar por nombre..."
                            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                        <select v-model="filterType"
                            class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">Todas</option>
                            <option value="Aceptada">Aceptadas</option>
                            <option value="Rechazada">Rechazadas</option>
                            <option value="Pendiente">Pendientes</option>
                        </select>
                    </div>

                    <!-- 📌 Lista de reuniones -->
                    <div class="border rounded-lg shadow p-4 mt-2 flex-grow h-[50vh] overflow-y-auto bg-white">
                        <ul v-if="filteredMeetings.length > 0">
                            <li v-for="meeting in filteredMeetings" :key="meeting.id" class="p-3 border-b">
                                <div class="flex items-center justify-between">
                                    <!-- Nombre del participante -->
                                    <div class="flex flex-wrap items-center justify-left space-x-3 w-2/3">
                                        <span
                                            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-500 text-lg font-medium">
                                            {{ getParticipant(meeting.requester_id)?.name || 'Desconocido' }}
                                        </span>
                                        <p class="text-gray-700 font-medium">desea reunirse con</p>
                                        <span
                                            class="px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-500 text-lg font-medium">
                                            {{ getParticipant(meeting.receiver_id)?.name || 'Desconocido' }}
                                        </span>
                                    </div>

                                    <!-- Botón "Más detalles" centrado y alineado a la misma altura -->
                                    <div class="flex items-center justify-center w-1/3">
                                        <button @click="openMeetingDetails(meeting)"
                                            class="bg-yellow-600 text-white text-sm md:text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 my-2 md:my-0">
                                            Más detalles
                                        </button>
                                    </div>

                                    <!-- Estado y botones a la derecha -->
                                    <div class="flex flex-wrap justify-center md:justify-end w-full md:w-1/3 space-x-2 mt-2 md:mt-0">
                                        <div v-if="meeting.status === 'Aceptada'" class="flex bg-green-500 rounded-full items-center space-x-2 py-1 px-3 m-1">
                                            <span class="text-white font-semibold">Aceptada</span>
                                        </div>
                                        <div v-else-if="meeting.status === 'Rechazada'"
                                            class="flex bg-red-500 rounded-full items-center space-x-2 py-1 px-3">
                                            <span class="text-white font-semibold">Rechazada</span>
                                        </div>

                                        <div v-if="meeting.status === 'Pendiente'" class="flex items-center space-x-2">
                                            <button @click="acceptMeeting(meeting)"
                                                class="btn-green">
                                                Aceptar reunión
                                            </button>
                                            <button @click="rejectMeeting(meeting)"
                                                class="btn-red">
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

                <div class="flex justify-end space-x-4">
                    <button @click="acceptAllMeetings"
                        class="btn-green text-lg">
                        Aceptar todas las reuniones pendientes
                    </button>
                    <button @click="cancelAllMeetings"
                        class="btn-red text-lg">
                        Cancelar todas las reuniones pendientes
                    </button>
                    <button @click="finalizeMeetingPeriod"
                        class="bg-gray-600 text-lg text-white py-2 px-4 rounded-lg hover:bg-gray-700">
                        Finalizar periodo de matcheo
                    </button>
                </div>
                <MeetingDetailsModal :show="showMeetingDetailsModal" :meeting="selectedMeeting"
                    @close="closeMeetingDetails" />
            </div>
        </template>
    </LayoutPage>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import Loading from "@/components/Loading.vue";
import MeetingDetailsModal from "@/components/MeetingDetailsModal.vue";

// Estado y store
const eventStore = useEventStore();
const { evento, meetings, loading, participants, error, success, info } = storeToRefs(eventStore);
const route = useRoute();
const showMeetingDetailsModal = ref(false);
const selectedMeeting = ref(null);

// Estado de la barra de búsqueda y filtro
const searchQuery = ref("");
const filterType = ref("all");

const filteredMeetings = computed(() => {

    return meetings.value
    .filter(meeting => {
            // Filtrar por estado
            if (filterType.value !== "all" && meeting.status !== filterType.value) {
                return false;
            }

            // Filtrar por nombre de participante
            const requester = getParticipant(meeting.requester_id);
            const receiver = getParticipant(meeting.receiver_id);
            const search = searchQuery.value.toLowerCase();

            return (
                requester?.name.toLowerCase().includes(search) ||
                receiver?.name.toLowerCase().includes(search)
            );
        })
        .filter(meeting => {
            if (filterType.value === "Aceptada") {
                return meeting.status === "Aceptada"; 
            } else if (filterType.value === "Rechazada") {
                return meeting.status === "Rechazada"; 
            } else if (filterType.value === "Pendiente") {
                return meeting.status === "Pendiente";
            } 
            return true;
        });

});


// Cargar datos al montar
onMounted(async () => {
    await eventStore.fetch(route.params.slug); // Obtener evento

    if (evento.value) {
        eventStore.fetchParticipants(evento.value.id);
        await eventStore.fetchMeetings(evento.value.id);
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
        await eventStore.fetchMeetings(evento.value.id); // Recargar la lista de reuniones
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

const acceptAllMeetings = async () => {
    await eventStore.acceptAllMeetings(evento.value.id);
};

const cancelAllMeetings = async () => {
    await eventStore.rejectAllMeetings(evento.value.id);
};

const finalizeMeetingPeriod = async () => {
    await eventStore.endMatchingPeriod(evento.value.id);
};

const getParticipant = (participant_id) => {
    return participantsMap.value[participant_id] || null;
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

</script>