<template>
  <div class="bg-blue-500 min-h-screen flex flex-col">
    <!-- Barra de navegación -->
    <nav class="bg-white shadow-md flex items-center px-4 h-12">
      <div class="font-bold text-blue-600">Rondas UNS</div> 

      <div v-if="authStore.authenticated" class="ml-auto flex space-x-4">
        <button @click="landingPage" class="px-3 py-1 h-9 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Inicio</button>
        <button @click="meetings" class="px-3 py-1 h-9 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Reuniones</button>
        <button @click="notifications" class="px-3 py-1 h-9 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Notificaciones</button>
        
        <!-- Botón de perfil circular más pequeño -->
        <button @click="deslogearse" class="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-gray-200">
          <i class="fa-solid fa-user text-blue-500 text-xs">Perfil</i> 
        </button>
      </div>
    </nav>

    <!-- Contenedor principal -->
    <div class="flex-1 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg w-full sm:w-full md:w-full xl:max-w-full p-6 sm:p-8 md:p-10 relative m-10">
        <slot />
      </div>
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

  const landingPage = () => {
    router.push({ name: "event-detail" });
  };

  const meetings = () => {
    router.push({ name: "event-meetings" });
  };

  const notifications = () => {
    router.push({ name: "event-notifications" });
  };

  const deslogearse = () => {
    authStore.logout()
  };

  onMounted(() => {
	if (!authStore.authenticated && route.name !== "event-detail" && route.name !== "login" && route.name !== "register") {
	  router.push({ name: "event-detail" });
	}
  });

  </script>
  