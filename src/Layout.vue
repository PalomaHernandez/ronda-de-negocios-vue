<template>
  <div class="bg-blue-500 min-h-screen">
    <!-- Barra de navegación -->
    <nav class="bg-white shadow-md flex items-center px-6 py-3 h-[8vh] flex-wrap relative">
      <div class="font-bold text-blue-600 text-xl sm:text-2xl w-full sm:w-auto">
        Rondas UNS
      </div>

      <div v-if="authStore.authenticated" class="ml-auto flex items-center space-x-4 sm:text-sm w-full sm:w-auto flex-wrap justify-between sm:justify-end">
        
        <!-- Menú en pantallas grandes -->
        <div class="hidden lg:flex space-x-4">
          <RouterLink :to="{ name: 'event-detail' }" class="btn text-sm sm:text-lg">
            <i class="fa-solid fa-house"></i>    
            Inicio
          </RouterLink>
          <RouterLink :to="{ name: 'event-meetings' }" class="btn text-sm sm:text-lg">
            <i class="fa-solid fa-handshake"></i>    
            Reuniones
          </RouterLink>
          <RouterLink :to="{ name: 'event-notifications' }" class="btn text-sm sm:text-lg">
            <i class="fa-solid fa-bell"></i>    
            Notificaciones
          </RouterLink>
        </div>

        <!-- Menú desplegable en pantallas pequeñas -->
        <div class="lg:hidden">
          <button @click="toggleMobileMenu" class="text-blue-500 text-lg">
            <i class="fa-solid fa-bars"></i> <!-- Icono de menú hamburguesa -->
          </button>
          
          <!-- Menú desplegable móvil -->
          <div v-if="mobileMenuOpen" class="absolute top-full w-48 bg-white rounded-lg shadow-lg z-10">
            <RouterLink :to="{ name: 'event-detail' }" class="block px-4 py-2 text-blue-500 hover:bg-gray-100">
              <i class="fa-solid fa-house"></i> Inicio
            </RouterLink>
            <RouterLink :to="{ name: 'event-meetings' }" class="block px-4 py-2 text-blue-500 hover:bg-gray-100">
              <i class="fa-solid fa-handshake"></i> Reuniones
            </RouterLink>
            <RouterLink :to="{ name: 'event-notifications' }" class="block px-4 py-2 text-blue-500 hover:bg-gray-100">
              <i class="fa-solid fa-bell"></i> Notificaciones
            </RouterLink>
          </div>
        </div>

        <!-- Botón de perfil con menú desplegable -->
        <div class="relative">
          <button @click="toggleMenu" class="dropdown-header">
            <i class="fa-solid fa-user text-blue-500 text-lg"></i>
          </button>

          <!-- Menú desplegable -->
          <div v-if="menuOpen" class="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <RouterLink :to="{ name: 'profile' }" class="dropdown-link">
              <i class="fa-solid fa-user"></i>
              Ver perfil
            </RouterLink>
            <button @click="deslogearse" class="dropdown-link text-red-600">
              <i class="fa-solid fa-right-from-bracket"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenedor principal con título y contenido -->
    <div class="flex-1 flex items-center justify-center h-[85vh] m-8">
      <div class="bg-white rounded-lg shadow-lg w-full sm:w-full md:w-full xl:max-w-full p-5 relative h-[85vh] overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const menuOpen = ref(false);
const mobileMenuOpen = ref(false); // Estado para el menú desplegable en móvil

const deslogearse = () => {
  menuOpen.value = false;
  authStore.logout();
};
const toggleMenu = () => menuOpen.value = !menuOpen.value;
const toggleMobileMenu = () => mobileMenuOpen.value = !mobileMenuOpen.value; // Función para abrir/cerrar el menú móvil

const closeMenuOnClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenuOnClickOutside);
});
</script>

