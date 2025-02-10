<template>
  <div class="bg-blue-500 min-h-screen flex flex-col">
    <!-- Barra de navegación -->
    <nav class="bg-white shadow-md flex items-center px-4 h-10">
      <div class="font-bold text-blue-600 text-lg">Rondas UNS</div>

      <div v-if="authStore.authenticated" class="ml-auto flex space-x-4 h-full items-center relative">
        <button @click="landingPage"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Inicio</button>
        <button @click="meetings"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Reuniones</button>
        <button @click="notifications"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Notificaciones</button>

        <!-- Botón de perfil con menú desplegable -->
        <div class="relative">
          <button @click="toggleMenu"
            class="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-gray-200">
            <i class="fa-solid fa-user text-blue-500 text-xs"></i>
          </button>

          <!-- Menú desplegable -->
          <div v-if="menuOpen" class="fixed top-12 right-4 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
            <button @click="verPerfil" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Ver perfil
            </button>
            <button @click="deslogearse" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
              Cerrar sesión
            </button>
          </div>

        </div>
      </div>
    </nav>

    <!-- Contenedor principal con SCROLL -->
    <div class="flex-1 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg w-full sm:w-full md:w-full xl:max-w-full p-6 sm:p-8 md:p-10 relative m-10 
                  max-h-[85vh] overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";

// Accedemos al store de autenticación
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Estado del menú desplegable
const menuOpen = ref(false);

// Métodos de navegación
const landingPage = () => {
  router.push({ name: "event-detail" });
};

const meetings = () => {
  router.push({ name: "event-meetings" });
};

const notifications = () => {
  router.push({ name: "event-notifications" });
};

const verPerfil = () => {
  menuOpen.value = false;
  router.push({ name: "profile" }); // Ajusta el nombre de la ruta según tu configuración
};

const deslogearse = () => {
  menuOpen.value = false;
  authStore.logout();
};

// Alternar el menú desplegable
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

// Cerrar menú si se hace clic fuera
const closeMenuOnClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    menuOpen.value = false;
  }
};

// Escuchar clics fuera del menú
onMounted(() => {
  document.addEventListener("click", closeMenuOnClickOutside);
});
</script>
