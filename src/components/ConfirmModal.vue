<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
        <p class="text-gray-700 mt-2">{{ message }}</p>
  
        <div class="flex justify-end mt-4 space-x-2">
          <button @click="$emit('cancel')" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            Cancelar
          </button>
          <button @click="$emit('confirm')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: Boolean,
    title: String,
    message: String,
  });
  
  defineEmits(["confirm", "cancel"]);
  </script>
  