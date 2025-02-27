<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div class="flex flex-col items-center">
          <div class="w-24 h-24 flex items-center justify-center shadow-lg border rounded-full">
            <img v-if="participant.logo_url" :src="participant.logo_url" alt="Logo"/>
            <i v-else class="fa-solid fa-circle-user text-gray-400 text-8xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mt-3">{{ participant.name }}</h2>
          <p class="text-gray-500 font-bold text-lg">{{ participant.email }}</p>
          <p v-if="participant.activity" class="text-gray-500 text-lg">{{ participant.activity || 'No disponible' }}</p>
        </div>
  
        <div class="mt-4 space-y-3">
          <div class="flex items-center bg-gray-100 p-3 rounded-lg">
            <i class="fa-solid fa-location-dot mr-2"></i>
            <p class="text-gray-700"><strong>Ubicación:</strong> {{ participant.location || 'No disponible' }}</p>
          </div>
  
          <div v-if="participant.interests" class="flex items-center bg-gray-100 p-3 rounded-lg">
            <i class="fa-solid fa-magnifying-glass mr-2"></i>
            <p class="text-gray-700"><strong>Intereses:</strong> {{ participant.interests || 'No disponible' }}</p>
          </div>
  
          <div v-if="participant.website" class="flex items-center bg-gray-100 p-3 rounded-lg">
            <i class="fa-solid fa-cloud mr-2"></i>
            <a :href="participant.website" target="_blank" class="text-gray-700">
              <strong>Sitio web:</strong> {{ participant.website || 'No disponible' }}
            </a>
          </div>
  
          <div class="flex items-center bg-gray-100 p-3 rounded-lg">
            <i class="fa-solid fa-store mr-2"></i>
            <p class="text-gray-700"><strong>Productos o Servicios:</strong> {{
              participant.products_services || 'No disponible' }}</p>
          </div>
        </div>
  
        <div v-if="participant.profile_images?.length" class="mt-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Galería</h3>
          <div class="grid grid-cols-3 gap-2">
            <img v-for="image in participant.profile_images" :key="image.id" :src="image.url" alt="Gallery image"
              class="w-24 h-24 object-cover rounded-lg shadow cursor-pointer transition transform hover:scale-105"
              @click="openImage(image.url)" />
          </div>
        </div>
  
        <ImageModal :imageUrl="selectedImage || ''" :visible="showImageModal" @update:visible="showImageModal = $event" />
  
        <!-- Botón de cierre -->
        <div class="flex justify-center mt-5">
          <button @click="$emit('close')" class="btn btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import ImageModal from "@/components/ImageModal.vue";
  
  defineProps({
    show: Boolean,
    participant: Object,
  });
  
  defineEmits(["close"]);
  
  const selectedImage = ref(null);
  const showImageModal = ref(false);
  
  const openImage = (imagePath) => {
    selectedImage.value = imagePath;
    showImageModal.value = true;
  };
  </script>
  