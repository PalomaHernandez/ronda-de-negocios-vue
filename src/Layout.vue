<template>
  <div class="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 min-h-screen">
    <!-- Barra de navegación -->
    <nav class="bg-sky-900 shadow-md flex items-center px-6 py-3 h-[8vh] flex relative">
      <RouterLink :to="{name: 'event-detail'}" class="!p-1">

					<img alt="Rondas UNS Logo" class="h-15 w-60" src="@/assets/logos/rondas-uns.png">

			</RouterLink>
      <div v-if="authStore.authenticated"
        class="ml-auto flex items-center space-x-4 sm:text-sm w-full sm:w-auto justify-end flex-wrap sm:justify-end">

        <!-- Menú en pantallas grandes -->
        <div v-if="isRegistered || isResponsible" class="hidden lg:flex space-x-4">
          <RouterLink :to="{ name: 'event-detail' }" class="nav-btn text-sm sm:text-lg">
            <i class="fa-solid fa-house"></i>
            Inicio
          </RouterLink>
          
          <button v-if="evento?.status == 'Inscripcion'" class="nav-btn text-sm sm:text-lg cursor-not-allowed opacity-60"
            title="No disponible durante la fase de inscripción">
            <i class="fa-solid fa-handshake"></i>
            Reuniones
          </button>

          <RouterLink v-else-if="!isResponsible" :to="{ name: 'event-meetings' }"
            class="nav-btn text-sm sm:text-lg">
            <i class="fa-solid fa-handshake"></i>
            Reuniones
          </RouterLink>
          
          <RouterLink v-else :to="{ name: 'participants-meetings' }" class="nav-btn text-sm sm:text-lg">
            <i class="fa-solid fa-handshake"></i>
            Reuniones
          </RouterLink>
          
          <RouterLink v-if="!isResponsible" :to="{ name: 'event-notifications' }" class="nav-btn text-sm sm:text-lg">
            <i class="fa-solid fa-bell"></i>
            Notificaciones
          </RouterLink>
          <RouterLink v-if="isResponsible" :to="{ name: 'participants' }" class="nav-btn text-sm sm:text-lg">
            <i class="fa-solid fa-users"></i> Participantes
          </RouterLink>
        </div>

        <!-- Menú desplegable en pantallas pequeñas -->
        <div v-if="isRegistered || isResponsible" class="lg:hidden">
          <button @click="toggleMobileMenu" class="text-white text-lg">
            <i class="fa-solid fa-bars"></i> <!-- Icono de menú hamburguesa -->
          </button>

          <!-- Menú desplegable móvil -->
          <div v-if="mobileMenuOpen" class="absolute top-full right-0 w-48 bg-white rounded-lg shadow-lg z-10 pr-2">
            <RouterLink :to="{ name: 'event-detail' }" class="block px-4 py-2 text-sky-700 hover:bg-gray-100">
              <i class="fa-solid fa-house"></i> Inicio
            </RouterLink>
            <button v-if="evento?.status == 'Inscripcion'" class="block px-4 py-2 text-sky-700 cursor-not-allowed opacity-60" 
              title="No disponible durante la fase de inscripción">
              <i class="fa-solid fa-handshake"></i> Reuniones
            </button>
            <RouterLink v-else-if="!isResponsible" :to="{ name: 'event-meetings' }"
              class="block px-4 py-2 text-sky-700 hover:bg-gray-100">
              <i class="fa-solid fa-handshake"></i> Reuniones
            </RouterLink>
            <RouterLink v-else :to="{ name: 'participants-meetings' }"
              class="block px-4 py-2 text-sky-700 hover:bg-gray-100">
              <i class="fa-solid fa-handshake"></i> Reuniones
            </RouterLink>
            <RouterLink v-if="!isResponsible" :to="{ name: 'event-notifications' }"
              class="block px-4 py-2 text-sky-700 hover:bg-gray-100">
              <i class="fa-solid fa-bell"></i> Notificaciones
            </RouterLink>
            <RouterLink v-if="isResponsible" :to="{ name: 'participants' }"
              class="block px-4 py-2 text-sky-700 hover:bg-gray-100">
              <i class="fa-solid fa-users"></i> Participantes
            </RouterLink>
          </div>
        </div>

        <!-- Botón de perfil con menú desplegable -->
        <div class="relative">
          <button @click="toggleMenu" class="dropdown-header">
            <i class="fa-solid fa-user text-white text-lg"></i>
          </button>

          <!-- Menú desplegable -->
          <div v-if="menuOpen" class="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <RouterLink v-if="!isResponsible && isRegistered" :to="{ name: 'profile' }" class="dropdown-link text-sky-700">
              <i class="fa-solid fa-user"></i>
              Ver perfil
            </RouterLink>
            <button @click="deslogearse" class="dropdown-link text-sky-700">
              <i class="fa-solid fa-right-from-bracket"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenedor principal con título y contenido -->
    <div class="flex-1 flex items-center justify-center h-[85vh] m-8 sm:h-auto">
      <div
        class="bg-white rounded-lg shadow-lg w-full sm:w-full md:w-full xl:max-w-full p-5 relative h-[85vh] overflow-y-auto pr-2 rounded-scroll">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount } from "vue";
import { useAuthStore } from "@/stores/auth";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { storeToRefs } from "pinia";

const eventStore = useEventStore();
const { evento } = storeToRefs(eventStore);

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const menuOpen = ref(false);
const mobileMenuOpen = ref(false);

const isResponsible = computed(() => authStore.isResponsible);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isRegistered = computed(() => authStore.isRegistered);


const deslogearse = () => {
  menuOpen.value = false;
  authStore.logout(route.params.slug);
};
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  mobileMenuOpen.value = false;
};
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  menuOpen.value = false;
}; // Función para abrir/cerrar el menú móvil

const closeMenuOnClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenuOnClickOutside);
});

onBeforeMount(() => {
  if (!isAuthenticated && router.currentRoute.value.name !== 'login' && router.currentRoute.value.name !== 'register') {
    this.authStore.logout(route.params.slug)
  }
})

</script>
