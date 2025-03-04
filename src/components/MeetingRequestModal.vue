<template>
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">Solicitud de reunión</h2>
  
        <label class="block text-gray-700">Objetivo:</label>
        <select v-model="meetingObjective" class="w-full p-2 border rounded-lg mb-4">
          <option value="Demandante">Busco tus servicios</option>
          <option value="Oferente">Ofrezco mis servicios</option>
          <option value="Ambos">Busco tus servicios y oferto los míos</option>
        </select>
  
        <label class="block text-gray-700">Motivo:</label>
        <textarea v-model="meetingReason" rows="3" class="w-full p-2 border rounded-lg mb-4"
          placeholder="Escribe el motivo de la reunión..."></textarea>
  
        <div class="flex justify-end space-x-2">
          <button @click="closeModal" class="btn-gray">
            Cancelar
          </button>
          <button @click="submitMeetingRequest" class="btn">
            Enviar solicitud
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    showModal: Boolean,
    selectedParticipant: Object,
    userId: Number,
    eventId: Number,
  });
  
  const emit = defineEmits(['close', 'submit']);
  
  const meetingObjective = ref("");
  const meetingReason = ref("");

  const closeModal = () => {
    emit("close");
    meetingObjective.value = "";
    meetingReason.value = "";
  };
  
  const submitMeetingRequest = () => {
    if (!meetingObjective.value || !meetingReason.value) {
      console.error('Faltan campos');
      return;
    }
  
    const meetingData = {
      requester_id: props.userId,
      receiver_id: props.selectedParticipant.id,
      event_id: props.eventId,
      reason: meetingReason.value,
      status: 'Pendiente',
      requester_role: meetingObjective.value,
    };
  
    emit("submit", meetingData);
    closeModal();
  };
  </script>
  