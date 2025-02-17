<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 class="text-2xl font-bold mb-4 text-center">Detalles de la Reunión</h2>
  
        <div v-if="meeting" class="grid grid-cols-3 gap-4 items-center">
          <!-- 📌 Columna 1: Solicitante -->
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Solicitante</p>
            <p class="text-lg font-semibold text-center">{{ meeting.requesterName }}</p>
            <button class="bg-yellow-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700">
              Más detalles
            </button>
          </div>
  
          <!-- 📌 Columna 2: Espacio vacío -->
          <div class="flex flex-col items-center"></div>
  
          <!-- 📌 Columna 3: Receptor -->
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Receptor</p>
            <p class="text-lg font-semibold text-center">{{ meeting.receiverName }}</p>
            <button class="bg-yellow-600 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700">
              Más detalles
            </button>
          </div>
        </div>
  
        <!-- 📌 Información adicional -->
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Rol</p>
            <p class="text-lg font-semibold">{{ formatRole(meeting.requester_role) }}</p>
          </div>
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Estado</p>
            <p class="text-lg font-semibold">{{ meeting.status }}</p>
          </div>
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-500">Rol</p>
            <p class="text-lg font-semibold">{{ formatRole(getReceiverRole(meeting.requester_role)) }}</p>
          </div>
        </div>
  
        <!-- 📌 Motivo -->
        <p class="mt-6 px-4 text-justify break-words">
          <strong>Motivo:</strong> {{ meeting.reason || 'No especificado' }}
        </p>
  
        <!-- 📌 Botón de cierre -->
        <div class="flex justify-end mt-6">
          <button @click="$emit('close')" class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: Boolean,
    meeting: Object
  });
  
  defineEmits(["close"]);
  
  const formatRole = (role) => {
    if (role === "Compra") return "Comprador";
    if (role === "Venta") return "Vendedor";
    if (role === "Ambos") return "Comprador y Vendedor";
    return role;
  };
  
  const getReceiverRole = (requesterRole) => {
    if (requesterRole === "Compra") return "Venta";
    if (requesterRole === "Venta") return "Compra";
    if (requesterRole === "Ambos") return "Ambos";
    return requesterRole;
  };
  </script>
  