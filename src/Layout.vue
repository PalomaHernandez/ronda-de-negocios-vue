<template>
	<div class="bg-blue-500 min-h-screen flex items-center justify-center">
	  <!-- Contenedor principal del rectángulo -->
	  <div class="absolute top-2 left-2 bg-yellow-300 px-4 py-2 rounded-tr-lg rounded-bl-lg text-sm font-bold text-gray-800">
		Rondas UNS
	  </div>
  
	  <!-- Contenedor blanco (ajustado para ocupar más espacio) -->
	  <div class="bg-white rounded-lg shadow-lg w-full sm:w-full md:w-full xl:max-w-full p-6 sm:p-8 md:p-10 relative m-10">
		<slot />
	  </div>
	</div>
  </template>
  
  <script setup>
  import { useAuthStore } from "@/stores/auth";
  import { useRouter, useRoute } from "vue-router";
  import { onMounted } from "vue";
  
  // Accedemos al store de autenticación
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();
  
  // Redirigir a EventDetail si el usuario no está autenticado
  onMounted(() => {
	if (!authStore.authenticated && route.name !== "EventDetail") {
	  router.push({ name: "EventDetail" });
	}
  });
  </script>
  