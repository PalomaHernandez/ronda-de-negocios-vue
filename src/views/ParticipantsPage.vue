<template>
    <LayoutPage>
        <Loading v-if="loading" />
        <div v-else class="w-full">
            <h2 class="text-2xl font-semibold">Participantes</h2>

            <div v-if="success" class="alert alert-success" @click="eventStore.clearMessages()">{{ success }}</div>
            <div v-if="error" class="alert alert-danger" @click="eventStore.clearMessages()">{{ error }}</div>
            <div v-if="info" class="alert alert-info" @click="eventStore.clearMessages()">{{ info }}</div>

            <div class="border rounded-lg shadow p-4 mt-2 flex-grow h-[60vh] overflow-y-auto bg-white">
                <ul v-if="participants.length > 0">
                    <li v-for="participant in participants" :key="participant.id" class="p-3 border-b">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full mr-3 object-cover">
                                    <img v-if="participant.logo_path" :src="participant.logo_path" alt="Logo"/>
                                    <i v-else class="fa-solid fa-circle-user text-gray-400 text-4xl"></i>
                                </div>
                                <div>
                                    <p class="text-lg font-medium">{{ participant.name }}</p>
                                    <p class="text-gray-500">{{ participant.email }}</p>
                                </div>
                            </div>

                            <div class="hidden md:flex space-x-3">
                                <button @click="openDetailsModal(participant)"
                                    class="bg-sky-700 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-sky-800">
                                    Más detalles
                                </button>
                                <button @click="downloadSchedule(participant)"
                                    class="bg-gray-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-gray-700">
                                    <i class="fa-solid fa-file"></i>
                                    Descargar cronograma
                                </button>
                                <button @click="confirmDelete(participant)"
                                    class="bg-red-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-600">
                                    <i class="fa-solid fa-trash"></i>
                                    Eliminar
                                </button>
                            </div>

                            <!-- Menú desplegable en pantallas pequeñas -->
                            <div class="md:hidden relative">
                                <button @click="toggleDropdown(participant.id)"
                                    class="bg-gray-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-gray-700">
                                    <i class="fa-solid fa-ellipsis-v"></i>
                                </button>

                                <div v-if="dropdownOpen === participant.id"
                                    class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                    <button @click="openDetailsModal(participant)"
                                        class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200">
                                        Más detalles
                                    </button>
                                    <button @click="downloadSchedule(participant)"
                                        class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200">
                                        <i class="fa-solid fa-file"></i> Descargar cronograma
                                    </button>
                                    <button @click="confirmDelete(participant)"
                                        class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-200">
                                        <i class="fa-solid fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <p v-else class="text-gray-500">No hay participantes registrados a este evento.</p>
            </div>

            <!-- 📌 Botón para descargar listado de asistencia -->
            <div class="flex justify-end mt-4">
                <button @click="downloadAttendanceList()"
                    class="bg-gray-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700">
                    <i class="fa-solid fa-download"></i>
                    Descargar listado de asistencia
                </button>
            </div>
        </div>
    </LayoutPage>
    <ParticipantDetailsModal :show="showDetailsModal" :participant="selectedParticipant"
            @close="showDetailsModal = false" />
        <ConfirmModal :show="showConfirmModal" title="Confirmar eliminación"
            message="¿Estás seguro de que querés eliminar este participante? Esta acción no se puede deshacer."
            @confirm="deleteParticipant" @cancel="showConfirmModal = false" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import ParticipantDetailsModal from "@/components/ParticipantDetailsModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loading from "@/components/Loading.vue";

const eventStore = useEventStore();
const { evento, participants, loading, error, success, info } = storeToRefs(eventStore);
const route = useRoute();
const dropdownOpen = ref(null);

onMounted(async () => {
    await eventStore.fetch(route.params.slug);

    if (evento.value) {
        eventStore.fetchParticipants(evento.value.id);
    }
});

const showDetailsModal = ref(false);
const selectedParticipant = ref(null);

const openDetailsModal = (participant) => {
    selectedParticipant.value = participant;
    showDetailsModal.value = true;
    dropdownOpen.value = null;
};

const showConfirmModal = ref(false);
const participantToDelete = ref(null);

const confirmDelete = (participant) => {
    participantToDelete.value = participant;
    showConfirmModal.value = true;
    dropdownOpen.value = null;
};

const deleteParticipant = async () => {
    try {
        await eventStore.removeParticipant(participantToDelete.value.id);
        showConfirmModal.value = false;
    } catch (error) {
        console.error("Error al eliminar participante:", error);
    }
};

const downloadSchedule = (participant) => {
    eventStore.downloadParticipantSchedule(participant);
};

const downloadAttendanceList = async () => {
    eventStore.downloadAttendanceList();
};

const toggleDropdown = (id) => {
    dropdownOpen.value = dropdownOpen.value === id ? null : id;
};
</script>
