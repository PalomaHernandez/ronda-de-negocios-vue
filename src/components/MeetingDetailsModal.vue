<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 class="text-2xl font-bold mb-4 text-center">Detalles de la reunión</h2>
  
        <div v-if="meeting" class="grid grid-cols-3 gap-4 items-center">
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Solicitante</p>
            <p class="text-lg font-semibold text-center">{{ meeting.requesterName }}</p>
            <button @click="openParticipantDetails(meeting.requester_id)" class="bg-sky-700 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-sky-800 m-2">
              Más detalles
            </button>
          </div>

          <div class="flex flex-col items-center"></div>
  
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Receptor</p>
            <p class="text-lg font-semibold text-center">{{ meeting.receiverName }}</p>
            <button @click="openParticipantDetails(meeting.receiver_id)"  class="bg-sky-700 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-sky-800 m-2">
              Más detalles
            </button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mt-6 bg-gray-200 p-2 rounded-full">
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Rol</p>
            <p class="text-lg font-semibold">{{ formatRole(meeting.requester_role) }}</p>
          </div>
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Estado</p>
            <div v-if="meeting.status === 'Aceptada'" class="flex bg-emerald-600 rounded-full items-center space-x-2 py-1 px-3 m-1">
              <span class="text-white font-semibold">Aceptada</span>
            </div>
            <div v-else-if="meeting.status === 'Rechazada'"
                class="flex bg-red-500 rounded-full items-center space-x-2 py-1 px-3">
                <span class="text-white font-semibold">Rechazada</span>
            </div>
            <div v-else-if="meeting.status === 'Pendiente'"
                class="flex bg-gray-500 rounded-full items-center space-x-2 py-1 px-3">
                <span class="text-white font-semibold">Pendiente</span>
            </div>
          </div>
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Rol</p>
            <p class="text-lg font-semibold">{{ formatRole(getReceiverRole(meeting.requester_role)) }}</p>
          </div>
        </div>

        <p class="mt-6 px-4 text-justify break-words p-2 rounded-full">
          <strong>Motivo:</strong> {{ meeting.reason || 'No especificado' }}
        </p>
  
        <div class="flex justify-end mt-6">
          <button @click="$emit('close')" class="btn btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
    <ParticipantDetailsModal :show="showParticipantDetailsModal" :participant="selectedParticipant"
                    @close="showParticipantDetailsModal = false" />
  </template>
  
  <script setup>
  import ParticipantDetailsModal from './ParticipantDetailsModal.vue';
  import { ref } from "vue"; 
  const props = defineProps({
    show: Boolean,
    meeting: Object,
    participants: Object | Array,
  });
  
  defineEmits(["close"]);

  const showParticipantDetailsModal = ref(false);
  const selectedParticipant = ref(null);

  const openParticipantDetails = (participant_id) => {
    const participant = props.participants[participant_id];
    if(participant){
      selectedParticipant.value = participant;
      showParticipantDetailsModal.value = true;
    }
  };
  
  const formatRole = (role) => {
    if (role === "Demandante") return "Demandante";
    if (role === "Oferente") return "Oferente";
    if (role === "Ambos") return "Demandante y Oferente";
    return role;
  };
  
  const getReceiverRole = (requesterRole) => {
    if (requesterRole === "Demandante") return "Oferente";
    if (requesterRole === "Oferente") return "Demandante";
    if (requesterRole === "Ambos") return "Ambos";
    return requesterRole;
  };
  </script>
  